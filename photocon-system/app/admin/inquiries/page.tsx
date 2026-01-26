import { getInquiries } from '@/app/actions/inquiry'
import { InquiryList } from './InquiryList'

export default async function InquiriesPage() {
    const inquiries = await getInquiries() || []

    // 型アサーション (DB型とフロント型で微妙に違う可能性があるため)
    // 実際にはInquiryList側で定義した型と、getInquiriesの戻り値が一致している必要がある
    const formattedInquiries = inquiries.map(i => ({
        ...i,
        status: i.status as 'pending' | 'done'
    }))

    return (
        <InquiryList initialInquiries={formattedInquiries} />
    )
}
