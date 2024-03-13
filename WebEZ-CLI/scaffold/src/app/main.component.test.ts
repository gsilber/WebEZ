import { describe, expect, test,beforeAll } from '@jest/globals';
import { MainComponent } from './main.component';
import {bootstrap} from 'webez';

describe('MainComponent', () => {
    beforeAll(() => {
        bootstrap<MainComponent>(MainComponent, true);
    });    
    describe('Constructor', () => {
        test('Create Instance', () => {
            const component=new MainComponent();
            expect(component).toBeInstanceOf(MainComponent);
        });
    });
});
