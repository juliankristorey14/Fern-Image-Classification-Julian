import { getSupabaseClient } from '@/lib/supabaseClient';
import type { ScanResult, FernDetails } from '@/types';

// Helper: map a DB scan row (joined with fern_species) to our app ScanResult type
function mapScanRow(row: any): ScanResult {
  const details: FernDetails | undefined = row.fern_species
    ? {
        commonName: row.fern_species.common_name,
        scientificName: row.fern_species.scientific_name,
        description: row.fern_species.description,
        habitat: row.fern_species.habitat,
        careRequirements: row.fern_species.care_requirements,
        funFacts: row.fern_species.fun_facts,
      }
    : undefined;

  return {
    id: row.id,
    userId: row.user_id,
    image: row.image_url,
    isPlant: row.is_plant,
    isFern: row.is_fern,
    species: row.species_slug ?? undefined,
    confidence: row.confidence,
    timestamp: row.created_at,
    details,
  };
}

// Create a scan record (used by ScanPage after classification)
export async function createScan(
  userId: string,
  imageUrl: string,
  isPlant: boolean,
  isFern: boolean,
  speciesSlug: string | null,
  confidence: number
): Promise<ScanResult> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('scans')
    .insert({
      user_id: userId,
      image_url: imageUrl,
      is_plant: isPlant,
      is_fern: isFern,
      species_slug: speciesSlug,
      confidence,
    })
    .select(`
      *,
      fern_species (
        slug,
        common_name,
        scientific_name,
        description,
        habitat,
        care_requirements,
        fun_facts
      )
    `)
    .single();

  if (error) {
    console.error('createScan error', error);
    throw new Error('Failed to save scan result.');
  }

  return mapScanRow(data);
}

// Fetch all scans for a given user (used by HistoryPage)
export async function getUserScans(userId: string): Promise<ScanResult[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('scans')
    .select(`
      *,
      fern_species (
        slug,
        common_name,
        scientific_name,
        description,
        habitat,
        care_requirements,
        fun_facts
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getUserScans error', error);
    return [];
  }

  return (data ?? []).map(mapScanRow);
}

// Fetch a single scan by its UUID (used by ResultsPage and FernDetailsPage)
export async function getScanById(scanId: string): Promise<ScanResult | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('scans')
    .select(`
      *,
      fern_species (
        slug,
        common_name,
        scientific_name,
        description,
        habitat,
        care_requirements,
        fun_facts
      )
    `)
    .eq('id', scanId)
    .single();

  if (error) {
    console.error('getScanById error', error);
    return null;
  }

  return mapScanRow(data);
}

// Admin helpers (optional, for admin pages)

// Fetch all scans (admin only)
export async function getAllScans(): Promise<ScanResult[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('scans')
    .select(`
      *,
      fern_species (
        slug,
        common_name,
        scientific_name,
        description,
        habitat,
        care_requirements,
        fun_facts
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getAllScans error', error);
    return [];
  }

  return (data ?? []).map(mapScanRow);
}

// Delete a scan (user or admin)
export async function deleteScan(scanId: string): Promise<boolean> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.from('scans').delete().eq('id', scanId);

  if (error) {
    console.error('deleteScan error', error);
    return false;
  }
  return true;
}
