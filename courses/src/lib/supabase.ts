import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

// Lazy singleton — solo se crea en el browser (app es output: 'export', sin servidor Node)
let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
	if (!_client) {
		_client = createBrowserClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
		);
	}
	return _client;
}
