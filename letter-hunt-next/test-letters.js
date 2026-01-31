// Test script to verify 56-67 letters are generated
// Run this in browser console on localhost:3000

console.log('🧪 TESTING LETTER GENERATION...');

// Test 1: Generate new game for Level 1 (1 letter type)
console.log('\n📊 Test 1: Level 1 - 1 letter type');
useGameStore.getState().generateNewGame(1, undefined, 'count');
const state1 = useGameStore.getState();
console.log('Result:', {
  level: state1.currentLevel,
  targetLetterTypes: state1.targetLetterTypes,
  targetLetterCount: state1.targetLetterCount,
  actualLetters: state1.solutionIndices.size,
  targetLetters: state1.targetLetters,
  expectedRange: '56-67',
  isCorrect: state1.solutionIndices.size >= 56 && state1.solutionIndices.size <= 67
});

// Test 2: Generate new game for Level 2 (2 letter types)
console.log('\n📊 Test 2: Level 2 - 2 letter types');
useGameStore.getState().generateNewGame(2, undefined, 'count');
const state2 = useGameStore.getState();
console.log('Result:', {
  level: state2.currentLevel,
  targetLetterTypes: state2.targetLetterTypes,
  targetLetterCount: state2.targetLetterCount,
  actualLetters: state2.solutionIndices.size,
  targetLetters: state2.targetLetters,
  expectedRange: '56-67',
  isCorrect: state2.solutionIndices.size >= 56 && state2.solutionIndices.size <= 67
});

// Test 3: Generate new game for Level 4 (3 letter types)
console.log('\n📊 Test 3: Level 4 - 3 letter types');
useGameStore.getState().generateNewGame(4, undefined, 'count');
const state3 = useGameStore.getState();
console.log('Result:', {
  level: state3.currentLevel,
  targetLetterTypes: state3.targetLetterTypes,
  targetLetterCount: state3.targetLetterCount,
  actualLetters: state3.solutionIndices.size,
  targetLetters: state3.targetLetters,
  expectedRange: '56-67',
  isCorrect: state3.solutionIndices.size >= 56 && state3.solutionIndices.size <= 67
});

// Summary
console.log('\n✅ SUMMARY:');
console.log(`Test 1 (Level 1): ${state1.solutionIndices.size >= 56 && state1.solutionIndices.size <= 67 ? 'PASS' : 'FAIL'}`);
console.log(`Test 2 (Level 2): ${state2.solutionIndices.size >= 56 && state2.solutionIndices.size <= 67 ? 'PASS' : 'FAIL'}`);
console.log(`Test 3 (Level 4): ${state3.solutionIndices.size >= 56 && state3.solutionIndices.size <= 67 ? 'PASS' : 'FAIL'}`);

// Check board generation logs
console.log('\n🔍 Check browser console for debug logs:');
console.log('🎯 getTargetLetterCount DEBUG: should show values in range 56-67');
console.log('🎲 BOARD GENERATION: should show distribution');