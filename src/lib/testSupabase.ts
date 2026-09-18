import { supabase } from './supabase';

export async function testSupabaseConnection(): Promise<void> {
  const { error } = await supabase
    .from('complaints')
    .select('id')
    .limit(1);

  if (error) {
    console.error('Supabase connection failed:', error.message);
    return;
  }

  console.log('Supabase connection successful!');
}
