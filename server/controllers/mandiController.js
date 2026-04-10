const mandiPrices = {
  'wheat': { price: 2275, unit: 'per quintal', trend: 'up', market: 'Azadpur Mandi' },
  'rice': { price: 2180, unit: 'per quintal', trend: 'stable', market: 'Azadpur Mandi' },
  'maize': { price: 1960, unit: 'per quintal', trend: 'down', market: 'Azadpur Mandi' },
  'potato': { price: 1250, unit: 'per quintal', trend: 'up', market: 'Azadpur Mandi' },
  'tomato': { price: 1850, unit: 'per quintal', trend: 'up', market: 'Azadpur Mandi' },
  'onion': { price: 2150, unit: 'per quintal', trend: 'down', market: 'Azadpur Mandi' },
  'chili': { price: 4850, unit: 'per quintal', trend: 'up', market: 'Azadpur Mandi' },
  'mustard': { price: 5450, unit: 'per quintal', trend: 'stable', market: 'Azadpur Mandi' }
};

export const getMandiPrices = async (req, res) => {
  try {
    const { crop, location } = req.query;
    
    let prices = Object.entries(mandiPrices).map(([key, value]) => ({
      crop: key,
      ...value
    }));
    
    if (crop && mandiPrices[crop.toLowerCase()]) {
      prices = [{
        crop: crop.toLowerCase(),
        ...mandiPrices[crop.toLowerCase()]
      }];
    }
    
    res.json({
      success: true,
      count: prices.length,
      prices,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching mandi prices'
    });
  }
};

export const getCropAdvice = async (req, res) => {
  try {
    const { crop } = req.params;
    
    const adviceData = {
      wheat: {
        sowingTime: 'October to December',
        harvestingTime: 'March to April',
        waterSchedule: 'Irrigate at 20-25 days interval',
        fertilizer: 'DAP 50kg + Urea 40kg per acre'
      },
      rice: {
        sowingTime: 'June to July',
        harvestingTime: 'October to November',
        waterSchedule: 'Standing water required',
        fertilizer: 'Urea 50kg + DAP 30kg per acre'
      },
      potato: {
        sowingTime: 'October to November',
        harvestingTime: 'February to March',
        waterSchedule: 'Irrigate every 10-15 days',
        fertilizer: 'NPK 50:50:50 kg per acre'
      },
      tomato: {
        sowingTime: 'November to December',
        harvestingTime: 'February to April',
        waterSchedule: 'Drip irrigation recommended',
        fertilizer: 'FYM 10 tons + NPK 40:60:40 kg per acre'
      }
    };
    
    const advice = adviceData[crop?.toLowerCase()] || {
      sowingTime: 'Consult local agriculture officer',
      harvestingTime: 'Varies by variety',
      waterSchedule: 'Maintain soil moisture',
      fertilizer: 'Soil test recommended'
    };
    
    res.json({
      success: true,
      crop: crop,
      advice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching crop advice'
    });
  }
};