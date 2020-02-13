import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'customStringThreeDots' })
export class CustomStringThreeDots implements PipeTransform {
    transform(value: string): string {
        console.log(value.length< 20);
        
        if(value.length < 20) {
            return value.trim();
        }

        return value.trim().substr(0, 20) + '...';
    }
}