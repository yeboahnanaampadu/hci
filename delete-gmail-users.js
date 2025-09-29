require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function deleteGmailUsers() {
  try {
    // Get all users
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()
    if (listError) {
      console.error('Error listing users:', listError)
      return
    }

    const gmailUsers = users.users.filter(user => user.email.endsWith('@gmail.com'))

    console.log(`Found ${gmailUsers.length} Gmail users to delete`)

    for (const user of gmailUsers) {
      console.log(`Deleting user: ${user.email}`)
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)
      if (deleteError) {
        console.error(`Error deleting ${user.email}:`, deleteError)
      } else {
        console.log(`Deleted ${user.email}`)
      }
    }

    console.log('Finished deleting Gmail users')
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}


deleteGmailUsers()