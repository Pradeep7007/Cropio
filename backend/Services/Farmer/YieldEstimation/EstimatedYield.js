module.exports = function EstimatedYield(req, res) {
    const { 
        crop, 
        landArea, 
        soilType, 
        waterAvailability, 
        irrigationMethod, 
        fertilizerUse,
        farmingMethod 
    } = req.body;

    // Helper to calculate a base score from 0-100
    let score = 70; // Start with a base score

    // Soil weight
    if (soilType === 'Loamy') score += 15;
    if (soilType === 'Clay') score += 5;
    if (soilType === 'Sandy') score -= 5;

    // Water weight
    if (waterAvailability === 'High') score += 10;
    if (waterAvailability === 'Low' && irrigationMethod !== 'Drip') score -= 15;
    if (waterAvailability === 'Low' && irrigationMethod === 'Drip') score -= 5;

    // Farming method weight
    if (farmingMethod === 'Organic') score += 5;
    if (farmingMethod === 'Hydroponic') score += 12;

    // Fertilizer weight
    if (fertilizerUse === 'None') score -= 10;
    if (fertilizerUse === 'Mixed') score += 8;

    // Clamp score
    score = Math.min(Math.max(score, 40), 98);

    // Generate dynamic titles and descriptions
    let title = "";
    let description = "";

    if (score > 85) {
        title = `Excellent ${crop.charAt(0).toUpperCase() + crop.slice(1)} Forecast`;
        description = `Your ${crop} yield is predicted to be exceptional (${score}% efficiency). The combination of ${soilType} soil and ${farmingMethod} practices is highly effective.`;
    } else if (score > 70) {
        title = `Strong ${crop.charAt(0).toUpperCase() + crop.slice(1)} Potential`;
        description = `You can expect a solid harvest with around ${score}% yield efficiency. Your ${irrigationMethod} irrigation strategy is helping stabilize growth.`;
    } else if (score > 55) {
        title = `Moderate ${crop.charAt(0).toUpperCase() + crop.slice(1)} Growth`;
        description = `Current predictions suggest a ${score}% efficiency. Consider optimizing ${fertilizerUse === 'None' ? 'fertilizer use' : 'water management'} to improve the outcome.`;
    } else {
        title = `Challenging ${crop.charAt(0).toUpperCase() + crop.slice(1)} Outlook`;
        description = `Predicted yield is lower than average (${score}%). ${soilType} soil with ${waterAvailability} water availability presents some hurdles. Explore Drip irrigation.`;
    }

    const result = {
        title,
        description: `${description} Estimated production: ${(parseFloat(landArea || 1) * (score / 10)).toFixed(1)} tons. Confidence Score: ${score}%`,
        efficiency: score
    };

    // Send response
    res.status(200).json(result);
};

