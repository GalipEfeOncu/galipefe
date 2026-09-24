import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeProjectArrays } from '../src/utils/projectData.js';
import { getProjectContent } from '../src/utils/projectContent.js';

test('project arrays discard malformed entries before public rendering', () => {
    const normalized = normalizeProjectArrays({
        tags: [' AI ', { label: 'broken' }, 'Web', 'AI', null],
        learningsTr: ['  Öğrenme  ', 12, null],
        learningsEn: { first: 'not a list' },
    });

    assert.deepEqual(normalized.tags, ['AI', 'Web']);
    assert.deepEqual(normalized.learningsTr, ['Öğrenme']);
    assert.deepEqual(normalized.learningsEn, []);
    assert.deepEqual(normalized.learnings, []);
});

test('localized project content ignores non-string learning items', () => {
    assert.deepEqual(getProjectContent({
        learningsEn: ['Useful note', { text: 'malformed' }, 'Another note'],
    }, 'en').learnings, ['Useful note', 'Another note']);
});
