import { useState } from 'react'
import { UploadCloud } from 'lucide-react'
import toast from 'react-hot-toast'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import * as transactionsApi from '../../api/transactions.api'

function CsvImportModal({ open, onClose, onImported }) {
  const [file, setFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  const handleClose = () => {
    setFile(null)
    setResult(null)
    onClose()
  }

  const handleImport = async () => {
    if (!file) return
    setIsSubmitting(true)
    try {
      const summary = await transactionsApi.importTransactionsCsv(file)
      setResult(summary)
      onImported()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Import failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Import transactions from CSV">
      {!result ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Columns: <code>date, type, category, amount, description</code>. Type is{' '}
            <code>income</code> or <code>expense</code>. Unknown categories are created
            automatically.
          </p>
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-stone-300 p-6 text-center hover:border-brand-400 dark:border-stone-700">
            <UploadCloud className="h-6 w-6 text-stone-400" />
            <span className="text-sm text-stone-600 dark:text-stone-300">
              {file ? file.name : 'Choose a .csv file'}
            </span>
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!file || isSubmitting}>
              {isSubmitting ? 'Importing…' : 'Import'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="rounded-lg bg-brand-50 p-3 text-sm text-brand-800 dark:bg-brand-900/30 dark:text-brand-200">
            Imported {result.imported} of {result.totalRows} rows.
          </div>
          {result.categoriesCreated.length > 0 && (
            <p className="text-sm text-stone-600 dark:text-stone-300">
              New categories created: {result.categoriesCreated.join(', ')}
            </p>
          )}
          {result.failed.length > 0 && (
            <div className="max-h-40 overflow-y-auto rounded-lg border border-rose-200 p-3 text-sm dark:border-rose-900">
              {result.failed.map((f) => (
                <p key={f.row} className="text-rose-600 dark:text-rose-400">
                  Row {f.row}: {f.reason}
                </p>
              ))}
            </div>
          )}
          <div className="flex justify-end">
            <Button onClick={handleClose}>Done</Button>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default CsvImportModal
