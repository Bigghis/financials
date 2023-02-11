import stringSimilarity from 'string-similarity';
import stocks_industries from '../../data/stocks_industry.json';

// https://pages.stern.nyu.edu/~adamodar/
// https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/variable.htm

/*
const industryNames = [
  "Advertising",
  "Aerospace/Defense",
  "Air Transport",
  "Apparel",
  "Auto & Truck",
  "Auto Parts",
  "Bank (Money Center)",
  "Banks (Regional)",
  "Beverage (Alcoholic)",
  "Beverage (Soft)",
  "Broadcasting",
  "Brokerage & Investment Banking",
  "Building Materials",
  "Business & Consumer Services",
  "Cable TV",
  "Chemical (Basic)",
  "Chemical (Diversified)",
  "Chemical (Specialty)",
  "Coal & Related Energy",
  "Computer Services",
  "Computers/Peripherals",
  "Construction Supplies",
  "Diversified",
  "Drugs (Biotechnology)",
  "Drugs (Pharmaceutical)",
  "Education",
  "Electrical Equipment",
  "Electronics (Consumer & Office)",
  "Electronics (General)",
  "Engineering/Construction",
  "Entertainment",
  "Environmental & Waste Services",
  "Farming/Agriculture",
  "Financial Svcs. (Non-bank & Insurance)",
  "Food Processing",
  "Food Wholesalers",
  "Furn/Home Furnishings",
  "Green & Renewable Energy",
  "Healthcare Products",
  "Healthcare Support Services",
  "Heathcare Information and Technology",
  "Homebuilding",
  "Hospitals/Healthcare Facilities",
  "Hotel/Gaming",
  "Household Products",
  "Information Services",
  "Insurance (General)",
  "Insurance (Life)",
  "Insurance (Prop/Cas.)",
  "Investments & Asset Management",
  "Machinery",
  "Metals & Mining",
  "Office Equipment & Services",
  "Oil/Gas (Integrated)",
  "Oil/Gas (Production and Exploration)",
  "Oil/Gas Distribution",
  "Oilfield Svcs/Equip.",
  "Packaging & Container",
  "Paper/Forest Products",
  "Power",
  "Precious Metals",
  "Publishing & Newspapers",
  "R.E.I.T.",
  "Real Estate (Development)",
  "Real Estate (General/Diversified)",
  "Real Estate (Operations & Services)",
  "Recreation",
  "Reinsurance",
  "Restaurant/Dining",
  "Retail (Automotive)",
  "Retail (Building Supply)",
  "Retail (Distributors)",
  "Retail (General)",
  "Retail (Grocery and Food)",
  "Retail (Online)",
  "Retail (Special Lines)",
  "Rubber& Tires",
  "Semiconductor",
  "Semiconductor Equip",
  "Shipbuilding & Marine",
  "Shoe",
  "Software (Entertainment)",
  "Software (Internet)",
  "Software (System & Application)",
  "Steel",
  "Telecom (Wireless)",
  "Telecom. Equipment",
  "Telecom. Services",
  "Tobacco",
  "Transportation",
  "Transportation (Railroads)",
  "Trucking",
  "Utility (General)",
  "Utility (Water)",
  "Total Market",
  "Total Market (without financials)"
]
*/

const errataCorrige = {
  'MEDIFAST INC': 'Medifast, Inc. (NYSE:MED)'
};


export const getIndustryName = (shortName) => {
  const stocks_industries_array = stocks_industries.map(stock => stock["Company Name"]);
  const industryName = shortName in errataCorrige ? errataCorrige[shortName] : shortName;
  const matches1 = stringSimilarity.findBestMatch(industryName, stocks_industries_array )
  return stocks_industries[matches1.bestMatchIndex]
}
