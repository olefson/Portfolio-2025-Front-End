const fs = require('fs');
const path = require('path');

// Path to the tools.json file
const toolsFilePath = path.join(__dirname, '../src/data/tools.json');

// Read the file
console.log('Reading tools.json...');
const toolsData = JSON.parse(fs.readFileSync(toolsFilePath, 'utf8'));

// Count tools with tips
const toolsWithTips = toolsData.tools.filter(tool => tool.tips && tool.tips.length > 0).length;
console.log(`Found ${toolsWithTips} tools with tips field.`);

// Remove tips from all tools
toolsData.tools = toolsData.tools.map(tool => {
  // Create a new object without the tips field
  const { tips, ...toolWithoutTips } = tool;
  return toolWithoutTips;
});

// Write the updated data back to the file
console.log('Writing updated tools.json...');
fs.writeFileSync(toolsFilePath, JSON.stringify(toolsData, null, 2), 'utf8');

console.log('Done! Tips field has been removed from all tools.'); 