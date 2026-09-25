import { useEffect, useState } from 'react'
import { Plus, Upload, Pencil, Trash2, Repeat } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Select from '../../components/common/Select'
import Input from '../../components/common/Input'
import Spinner from '../../components/common/Spinner'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import TransactionFormModal from './TransactionFormModal'
import CsvImportModal from './CsvImportModal'
import * as transactionsApi from '../../api/transactions.api'
import * as categoriesApi from '../../api/categories.api'
import { formatCurrency } from '../../utils/format'
import { checkAndNotifyBudget } from '../../utils/budgetAlerts'

const emptyFilters = { startDate: '', endDate: '', categoryId: '', type: '' }

function Transactions() {
  const [transactions, setTransactions] = useState(null)
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState(emptyFilters)
  const [formOpen, setFormOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [deletingTransaction, setDeletingTransaction] = useState(null)

  const load = () => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''))
    transactionsApi.listTransactions(params).then(setTransactions)
  }

  useEffect(() => {
    categoriesApi.listCategories().then(setCategories)
  }, [])

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const handleSubmit = async (data) => {
    try {
      if (editingTransaction) {
        await transactionsApi.updateTransaction(editingTransaction.id, {
          type: data.type,
          categoryId: data.categoryId,
          amount: data.amount,
          date: data.date,
          description: data.description,
        })
      } else {
        await transactionsApi.createTransaction(data)
      }
      setFormOpen(false)
      setEditingTransaction(null)
      load()
      toast.success(editingTransaction ? 'Transaction updated' : 'Transaction added')
      checkAndNotifyBudget(Number(data.categoryId), data.type)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Something went wrong')
    }
  }

  const handleDelete = async () => {
    try {
      await transactionsApi.deleteTransaction(deletingTransaction.id)
      setDeletingTransaction(null)
      load()
      toast.success('Transaction deleted')
    } catch (err) {
      setDeletingTransaction(null)
      toast.error(err.response?.data?.message ?? 'Could not delete transaction')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">Transactions</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setImportOpen(true)}>
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          <Button
            onClick={() => {
              setEditingTransaction(null)
              setFormOpen(true)
            }}
          >
            <Plus className="h-4 w-4" />
            Add transaction
          </Button>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Input
            type="date"
            label="From"
            value={filters.startDate}
            onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))}
          />
          <Input
            type="date"
            label="To"
            value={filters.endDate}
            onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))}
          />
          <Select
            label="Category"
            value={filters.categoryId}
            onChange={(e) => setFilters((f) => ({ ...f, categoryId: e.target.value }))}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          <Select
            label="Type"
            value={filters.type}
            onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
          >
            <option value="">All types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </Select>
        </div>
        {(filters.startDate || filters.endDate || filters.categoryId || filters.type) && (
          <button
            onClick={() => setFilters(emptyFilters)}
            className="mt-3 text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            Clear filters
          </button>
        )}
      </Card>

      {!transactions ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-6 w-6 text-stone-400" />
        </div>
      ) : (
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-left text-stone-500 dark:border-stone-800 dark:text-stone-400">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 text-right font-medium">Amount</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td className="whitespace-nowrap px-4 py-3 text-stone-600 dark:text-stone-300">
                      {t.date.slice(0, 10)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
                        {t.category.name}
                        {t.isRecurringTemplate && (
                          <Repeat className="h-3.5 w-3.5 text-stone-400" />
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-500 dark:text-stone-400">
                      {t.description || '—'}
                    </td>
                    <td
                      className={`whitespace-nowrap px-4 py-3 text-right font-medium ${
                        t.type === 'INCOME'
                          ? 'text-brand-700 dark:text-brand-400'
                          : 'text-stone-900 dark:text-stone-100'
                      }`}
                    >
                      {t.type === 'INCOME' ? '+' : '-'}
                      {formatCurrency(t.amount)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditingTransaction(t)
                            setFormOpen(true)
                          }}
                          aria-label="Edit transaction"
                          className="rounded-md p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 dark:hover:bg-stone-800"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeletingTransaction(t)}
                          aria-label="Delete transaction"
                          className="rounded-md p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {transactions.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-stone-400 dark:text-stone-500">
                No transactions yet.
              </p>
            )}
          </div>
        </Card>
      )}

      <TransactionFormModal
        open={formOpen}
        initialValues={editingTransaction}
        onClose={() => {
          setFormOpen(false)
          setEditingTransaction(null)
        }}
        onSubmit={handleSubmit}
      />

      <CsvImportModal open={importOpen} onClose={() => setImportOpen(false)} onImported={load} />

      <ConfirmDialog
        open={Boolean(deletingTransaction)}
        title="Delete transaction"
        message="Delete this transaction? This can't be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeletingTransaction(null)}
      />
    </div>
  )
}

export default Transactions
