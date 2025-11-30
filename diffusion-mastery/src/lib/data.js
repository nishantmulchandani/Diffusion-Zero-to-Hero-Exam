import fs from 'fs';
import path from 'path';

const TESTS_DIRECTORY = path.join(process.cwd(), 'tests');

export function getAllModuleIds() {
  try {
    const fileNames = fs.readdirSync(TESTS_DIRECTORY);
    return fileNames
      .filter((fileName) => fileName.endsWith('.json'))
      .map((fileName) => ({
        params: {
          moduleId: fileName.replace(/\.json$/, ''),
        },
      }));
  } catch (error) {
    console.error('Error reading tests directory:', error);
    return [];
  }
}

export function getModuleData(moduleId) {
  try {
    const fullPath = path.join(TESTS_DIRECTORY, `${moduleId}.json`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error reading module data for ${moduleId}:`, error);
    return null;
  }
}

export function getAllModulesList() {
  try {
    const fileNames = fs.readdirSync(TESTS_DIRECTORY);
    const modules = fileNames
      .filter((fileName) => fileName.endsWith('.json'))
      .map((fileName) => {
        const fullPath = path.join(TESTS_DIRECTORY, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const data = JSON.parse(fileContents);
        return {
          id: fileName.replace(/\.json$/, ''),
          title: data.module_name.replace(/_/g, ' '),
          difficulty: data.difficulty_level
        };
      });
    return modules;
  } catch (error) {
    console.error('Error getting modules list:', error);
    return [];
  }
}
