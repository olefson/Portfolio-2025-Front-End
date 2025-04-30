const fs = require('fs');
const path = require('path');

// Path to the tools.json file
const toolsFilePath = path.join(__dirname, '../src/data/tools.json');

// Read the file
console.log('Reading tools.json...');
let toolsData;
try {
  toolsData = JSON.parse(fs.readFileSync(toolsFilePath, 'utf8'));
} catch (error) {
  console.error('Error reading or parsing tools.json:', error);
  process.exit(1);
}

// Date to update to
const targetDate = '2025-04-01';
const oldDate = '2024-02-24';
let updatedCount = 0;

// Update the addedOn date for tools added on the old date
toolsData.tools = toolsData.tools.map(tool => {
  if (tool.addedOn === oldDate) {
    tool.addedOn = targetDate;
    updatedCount++;
    console.log(`Updated date for tool: ${tool.title}`);
  }
  return tool;
});

// Write the updated data back to the file
if (updatedCount > 0) {
  console.log(`\nWriting updated tools.json... Found and updated ${updatedCount} entries.`);
  try {
    fs.writeFileSync(toolsFilePath, JSON.stringify(toolsData, null, 2), 'utf8');
    console.log('Successfully updated tools.json.');
  } catch (error) {
    console.error('Error writing updated tools.json:', error);
    process.exit(1);
  }
} else {
  console.log('No entries found with the date 2024-02-24. No changes made.');
}

console.log('Date update script finished.'); 