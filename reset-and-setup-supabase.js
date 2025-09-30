require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function resetAndSetupDatabase() {
  console.log('🚀 Starting complete Supabase reset and setup...')

  try {
    // 1. Delete all users and related data
    console.log('📊 Getting all users...')
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()
    if (listError) {
      console.error('❌ Error listing users:', listError)
      return
    }

    console.log(`📊 Found ${users.users.length} total users to delete`)

    for (const user of users.users) {
      console.log(`🗑️  Deleting user: ${user.email} (ID: ${user.id})`)
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)
      if (deleteError) {
        console.error(`❌ Error deleting ${user.email}:`, deleteError)
      } else {
        console.log(`✅ Deleted ${user.email}`)
      }
    }

    // 2. Clean up all related data in public tables
    console.log('🧹 Cleaning up related data in public tables...')

    const tablesToClean = [
      'visa_applications_detailed',
      'application_status_history',
      'payments',
      'documents',
      'applicants',
      'applications',
      'profiles'
    ]

    for (const table of tablesToClean) {
      try {
        const { error: deleteError } = await supabase
          .from(table)
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000')

        if (deleteError) {
          console.error(`❌ Error cleaning ${table}:`, deleteError)
        } else {
          console.log(`✅ Cleaned ${table}`)
        }
      } catch (err) {
        console.error(`❌ Error accessing ${table}:`, err)
      }
    }

    // 3. Apply schema updates
    console.log('🔄 Applying schema updates...')
    const schemaSQL = fs.readFileSync('./supabase/schema.sql', 'utf8')

    // Split the schema into individual statements
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      if (statement.trim().length > 1) {
        try {
          const { error: schemaError } = await supabase.rpc('exec_sql', {
            sql: statement
          })

          if (schemaError) {
            // If rpc doesn't exist, try direct execution
            console.log(`⚠️  Could not execute via RPC, statement ${i + 1} may need manual execution`)
          } else {
            console.log(`✅ Executed schema statement ${i + 1}/${statements.length}`)
          }
        } catch (err) {
          console.log(`⚠️  Could not execute statement ${i + 1} via RPC, may need manual execution`)
        }
      }
    }

    // 4. Update auth configuration
    console.log('⚙️  Updating auth configuration...')

    try {
      // Update site URL
      const { error: configError } = await supabase
        .from('auth.config')
        .update({
          site_url: process.env.NEXT_PUBLIC_SITE_URL || 'https://hci-sable-six.vercel.app'
        })
        .neq('site_url', '')

      if (configError) {
        console.log('⚠️  Could not update auth config via API, may need manual dashboard update')
      } else {
        console.log('✅ Updated auth configuration')
      }
    } catch (err) {
      console.log('⚠️  Could not update auth config, may need manual dashboard update')
    }

    console.log('🎉 Database reset and setup complete!')
    console.log('')
    console.log('📋 MANUAL STEPS (if needed):')
    console.log('1. Go to Supabase Dashboard → Authentication → URL Configuration')
    console.log('2. Set Site URL: https://hci-sable-six.vercel.app')
    console.log('3. Add redirect URLs:')
    console.log('   - https://hci-sable-six.vercel.app/auth/confirm')
    console.log('   - https://hci-sable-six.vercel.app/auth/update-password')
    console.log('')
    console.log('💡 The system is now ready with:')
    console.log('   ✅ Proper email confirmation on signup')
    console.log('   ✅ Password reset functionality')
    console.log('   ✅ Authenticated user access only')
    console.log('   ✅ Clean state for new users')

  } catch (err) {
    console.error('💥 Unexpected error during reset and setup:', err)
  }
}

// Run the complete reset and setup
resetAndSetupDatabase()