import { getAccountDeletionRequests } from './action'
import { AccountDeletionList } from './AccountDeletionList'

export default async function AccountDeletionsPage() {
    const requests = await getAccountDeletionRequests()

    return <AccountDeletionList initialRequests={requests} />
}
