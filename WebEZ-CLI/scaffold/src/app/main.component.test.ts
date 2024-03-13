import { describe, expect, test } from '@jest/globals';
import { MainComponent } from './main.component';

describe('MainComponent', () => {
    describe('Constructor', () => {
        test('Create Instance', () => {
            const component=new MainComponent();
            expect(component).toBeInstanceOf(MainComponent);
        });
    });
});