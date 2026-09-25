import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Spinner from '../../components/common/Spinner'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import AnnouncementFormModal from './AnnouncementFormModal'
import * as announcementsApi from '../../api/announcements.api'

function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const load = () => announcementsApi.listAnnouncements().then(setAnnouncements)

  useEffect(() => {
    load()
  }, [])

  const handleSubmit = async (data) => {
    try {
      if (editing) {
        await announcementsApi.updateAnnouncement(editing.id, data)
      } else {
        await announcementsApi.createAnnouncement(data)
      }
      setFormOpen(false)
      setEditing(null)
      load()
      toast.success(editing ? 'Announcement updated' : 'Announcement posted')
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Something went wrong')
    }
  }

  const handleDelete = async () => {
    try {
      await announcementsApi.deleteAnnouncement(deleting.id)
      setDeleting(null)
      load()
      toast.success('Announcement removed')
    } catch (err) {
      setDeleting(null)
      toast.error(err.response?.data?.message ?? 'Could not remove announcement')
    }
  }

  if (!announcements) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="h-6 w-6 text-stone-400" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
          Announcements
        </h1>
        <Button
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
          New announcement
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {announcements.map((a) => (
          <Card key={a.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-medium text-stone-900 dark:text-stone-100">{a.title}</h2>
                <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">{a.body}</p>
                <p className="mt-2 text-xs text-stone-400 dark:text-stone-500">
                  {new Date(a.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => {
                    setEditing(a)
                    setFormOpen(true)
                  }}
                  aria-label="Edit announcement"
                  className="rounded-md p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 dark:hover:bg-stone-800"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleting(a)}
                  aria-label="Delete announcement"
                  className="rounded-md p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/30"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
        {announcements.length === 0 && (
          <Card>
            <p className="text-sm text-stone-500 dark:text-stone-400">No announcements yet.</p>
          </Card>
        )}
      </div>

      <AnnouncementFormModal
        open={formOpen}
        initialValues={editing}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Remove announcement"
        message={`Remove "${deleting?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}

export default AdminAnnouncements
