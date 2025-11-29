import { getSupabaseClient } from '@/lib/supabaseClient';
import type { FernDetails } from '@/types';

// Helper: map fern_species row to FernDetails
function mapSpeciesRow(row: any): FernDetails {
  return {
    commonName: row.common_name,
    scientificName: row.scientific_name,
    description: row.description,
    habitat: row.habitat,
    careRequirements: row.care_requirements,
    funFacts: row.fun_facts,
  };
}

// Fetch all fern species (admin or public)
export async function getAllFernSpecies(): Promise<Record<string, FernDetails>> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('fern_species')
    .select('*')
    .order('common_name', { ascending: true });

  if (error) {
    console.error('getAllFernSpecies error', error);
    return {};
  }

  const result: Record<string, FernDetails> = {};
  for (const row of data ?? []) {
    result[row.slug] = mapSpeciesRow(row);
  }
  return result;
}

// Add a new fern species (admin only)
export async function addFernSpecies(
  slug: string,
  details: FernDetails
): Promise<boolean> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.from('fern_species').insert({
    slug,
    common_name: details.commonName,
    scientific_name: details.scientificName,
    description: details.description,
    habitat: details.habitat,
    care_requirements: details.careRequirements,
    fun_facts: details.funFacts,
  });

  if (error) {
    console.error('addFernSpecies error', error);
    return false;
  }
  return true;
}

// Update an existing fern species (admin only)
export async function updateFernSpecies(
  slug: string,
  details: FernDetails
): Promise<boolean> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('fern_species')
    .update({
      common_name: details.commonName,
      scientific_name: details.scientificName,
      description: details.description,
      habitat: details.habitat,
      care_requirements: details.careRequirements,
      fun_facts: details.funFacts,
    })
    .eq('slug', slug);

  if (error) {
    console.error('updateFernSpecies error', error);
    return false;
  }
  return true;
}

// Delete a fern species (admin only)
export async function deleteFernSpecies(slug: string): Promise<boolean> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('fern_species')
    .delete()
    .eq('slug', slug);

  if (error) {
    console.error('deleteFernSpecies error', error);
    return false;
  }
  return true;
}
