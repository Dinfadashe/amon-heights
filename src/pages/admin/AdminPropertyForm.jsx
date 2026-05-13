import AdminLayout from '../../components/layout/AdminLayout'
import PropertyForm from '../../components/shared/PropertyForm'
import { useParams } from 'react-router-dom'
export default function AdminPropertyForm() {
  const {id} = useParams()
  return (
    <AdminLayout title={id ? 'Edit Property' : 'Add New Property'}>
      <PropertyForm backPath="/admin/properties" successPath="/admin/properties"/>
    </AdminLayout>
  )
}
