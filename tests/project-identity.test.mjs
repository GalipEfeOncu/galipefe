import test from 'node:test';
import assert from 'node:assert/strict';
import {
    collectProjectIdentities,
    mergeProjectIdentities,
    nextAvailableId,
    nextAvailableIdFrom,
} from '../src/utils/projectIdentity.js';

test('numeric IDs keep the smallest positive gap as the next project ID', () => {
    const projects = [{ id: 1 }, { id: 3 }, { id: '4' }, { id: -1 }, { id: 'not-a-number' }];

    assert.equal(nextAvailableId(projects), 2);
    assert.equal(nextAvailableIdFrom([1, 2, 4]), 3);
});

test('identity collection and transaction state retain unique existing IDs and keys', () => {
    const projects = [
        { id: 1, translationKey: 'proj_1' },
        { id: 1, translationKey: 'proj_1' },
        { id: 3, translationKey: 'proj_3' },
    ];
    const stored = { usedIds: [1, 2], usedTranslationKeys: ['proj_1', 'proj_2'] };

    assert.deepEqual(collectProjectIdentities(projects), {
        usedIds: [1, 3],
        usedTranslationKeys: ['proj_1', 'proj_3'],
    });
    assert.deepEqual(mergeProjectIdentities(stored, projects), {
        usedIds: [1, 2, 3],
        usedTranslationKeys: ['proj_1', 'proj_2', 'proj_3'],
    });
});
