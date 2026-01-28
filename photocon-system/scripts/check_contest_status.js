
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://kjxdxoubwsazllutefgv.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqeGR4b3Vid3NhemxsdXRlZmd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI2MjQwNiwiZXhwIjoyMDgwODM4NDA2fQ.7Cw4SX_XPPVeNq3IZjoQO26xwChn4BjDuM5S5b4JX9M'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function checkContests() {
    console.log('Connecting to Supabase...')
    const { data: contests, error } = await supabase
        .from('contests')
        .select('id, name, status, end_date')

    if (error) {
        console.error('Error fetching contests:', error)
        return
    }

    console.log('--- CONTEST STATUSES ---')
    contests.forEach(c => {
        console.log(`[${c.status}] ${c.name} (End: ${c.end_date})`)
    })
    console.log('------------------------')
}

checkContests()
