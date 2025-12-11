// Baltimore area ZIP codes with their corresponding neighborhoods/areas
export const baltimoreZipCodes: Record<string, string> = {
  // Baltimore City
  '21201': 'Downtown Baltimore / Inner Harbor',
  '21202': 'Downtown East / Little Italy',
  '21205': 'Highlandtown / Canton / Patterson Park',
  '21206': 'Hamilton / Lauraville / Gardenville',
  '21207': 'Gwynn Oak / Windsor Hills',
  '21208': 'Pikesville / Owings Mills',
  '21209': 'Mount Washington / Cheswolde',
  '21210': 'Roland Park / Hampden / Cross Keys',
  '21211': 'Charles Village / Remington / Old Goucher',
  '21212': 'Govans / Homeland / Waverly',
  '21213': 'Clifton Park / Belair-Edison',
  '21214': 'Hamilton / Parkville / Overlea',
  '21215': 'Park Heights / Arlington / Hilton',
  '21216': 'West Baltimore / Mondawmin',
  '21217': 'Druid Heights / Reservoir Hill',
  '21218': 'Barclay / Greenmount East / Johnston Square',
  '21223': 'Westport / Cherry Hill / Brooklyn',
  '21224': 'Highlandtown / Canton / Greektown',
  '21225': 'Brooklyn / Curtis Bay',
  '21226': 'Brooklyn Park / Ferndale / Pumphrey',
  '21227': 'Halethorpe / Arbutus',
  '21228': 'Catonsville / Woodlawn / Rolling Road',
  '21229': 'Catonsville / Westview / Windsor Mill',
  '21230': 'Federal Hill / Locust Point / Riverside',
  '21231': 'Fells Point / Upper Fells Point',
  '21234': 'Parkville / Carney / Overlea',
  '21235': 'Belair-Edison / Frankford',
  '21236': 'Nottingham / White Marsh / Perry Hall',
  '21237': 'Rosedale / Middle River',
  '21239': 'Cedonia / Frankford / Hamilton',
  '21244': 'Windsor Mill / Woodlawn / Randallstown',
  '21250': 'UMBC / Security / Woodlawn',
  '21251': 'Towson University Campus',
  '21252': 'Towson Business District',
  '21286': 'Towson',
  '21287': 'Johns Hopkins University / Medical Campus',
  
  // Baltimore County
  '21093': 'Lutherville / Timonium',
  '21204': 'Towson / Loch Raven',
  '21221': 'Essex / Middle River',
  '21222': 'Dundalk',
  
  // Anne Arundel County
  '21032': 'Crownsville / Gambrills',
  '21037': 'Edgewater',
  '21054': 'Gambrills',
  '21060': 'Glen Burnie',
  '21061': 'Glen Burnie',
  '21062': 'Glen Burnie',
  '21076': 'Hanover',
  '21090': 'Linthicum',
  '21401': 'Annapolis',
  '21402': 'Annapolis',
  '21403': 'Annapolis',
  '21409': 'Annapolis',
  
  // Howard County
  '21029': 'Clarksville',
  '21036': 'Dayton',
  '21042': 'Ellicott City',
  '21043': 'Ellicott City',
  '21044': 'Columbia',
  '21045': 'Columbia',
  '21046': 'Columbia',
  '21075': 'Elkridge',
  '21794': 'Lisbon',
  
  // Harford County
  '21009': 'Abingdon',
  '21010': 'Aberdeen',
  '21014': 'Bel Air',
  '21015': 'Bel Air',
  '21017': 'Belcamp',
  '21040': 'Edgewood',
  '21047': 'Fallston',
  '21078': 'Havre de Grace',
  '21085': 'Joppatowne',
};

/**
 * Get location name for a given ZIP code
 * Returns the neighborhood/area name or null if not found
 */
export function getLocationByZipCode(zipCode: string): string | null {
  return baltimoreZipCodes[zipCode] || null;
}

/**
 * Search for ZIP codes by location name (partial match)
 * Returns array of matching ZIP codes with their locations
 */
export function searchZipCodesByLocation(query: string): Array<{ zipCode: string; location: string }> {
  if (!query || query.length < 2) return [];
  
  const normalizedQuery = query.toLowerCase();
  const results: Array<{ zipCode: string; location: string }> = [];
  
  Object.entries(baltimoreZipCodes).forEach(([zipCode, location]) => {
    if (location.toLowerCase().includes(normalizedQuery)) {
      results.push({ zipCode, location });
    }
  });
  
  return results;
}

/**
 * Get suggestions for a partial ZIP code entry
 * Returns array of matching ZIP codes with their locations
 */
export function getZipCodeSuggestions(partialZip: string): Array<{ zipCode: string; location: string }> {
  if (!partialZip || partialZip.length === 0) return [];
  
  const results: Array<{ zipCode: string; location: string }> = [];
  
  Object.entries(baltimoreZipCodes).forEach(([zipCode, location]) => {
    if (zipCode.startsWith(partialZip)) {
      results.push({ zipCode, location });
    }
  });
  
  // Limit to 10 suggestions
  return results.slice(0, 10);
}

/**
 * Validate if a ZIP code is in the Baltimore area
 */
export function isValidBaltimoreZipCode(zipCode: string): boolean {
  return zipCode in baltimoreZipCodes;
}
