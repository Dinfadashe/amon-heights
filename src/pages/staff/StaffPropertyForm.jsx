import StaffLayout from '../../components/layout/StaffLayout'
import PropertyForm from '../../components/shared/PropertyForm'
import { useParams } from 'react-router-dom'
export default function StaffPropertyForm() {
  const {id} = useParams()
  return (
    <StaffLayout title={id ? 'Edit Property' : 'Add New Property'}>
      <PropertyForm backPath="/staff/properties" successPath="/staff/properties"/>
    </StaffLayout>
  )
}
