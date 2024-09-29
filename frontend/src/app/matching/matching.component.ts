import { Component, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AccordionModule } from 'primeng/accordion';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { MultiSelectModule } from 'primeng/multiselect';
import { ChipModule } from 'primeng/chip';
import { FindingMatchComponent } from './finding-match/finding-match.component';
import { UserCriteria } from './user-criteria.model';
import { RetryMatchingComponent } from './retry-matching/retry-matching.component';

@Component({
    selector: 'app-matching',
    standalone: true,
    imports: [
        FindingMatchComponent,
        RetryMatchingComponent,
        ChipModule,
        MultiSelectModule,
        PanelModule,
        DropdownModule,
        RadioButtonModule,
        AccordionModule,
        ButtonModule,
        FormsModule,
        CommonModule,
    ],
    templateUrl: './matching.component.html',
    styleUrl: './matching.component.css',
})
export class MatchingComponent implements OnInit {
    userCriteria: UserCriteria = {
        topics: null,
        difficulty: null,
    };

    topics: string[] = [];

    difficulties = ['Easy', 'Medium', 'Hard'];

    isProcessingMatch = false;
    isMatchFailed = false;

    ngOnInit(): void {
        this.fetchTopics();
    }

    fetchTopics() {
        this.topics = ['Algorithms', 'Data Structures', 'Database Design', 'Machine Learning', 'Web Development'];
    }

    onMatch() {
        console.log({
            topic: this.userCriteria.topics,
            difficulty: this.userCriteria.difficulty
        });
        this.isProcessingMatch = true;
        // TODO: Add API request to start matching.
    }

    onMatchFailed() {
        this.isProcessingMatch = false;
        this.isMatchFailed = true;
    }

    onRetryMatchRequest() {
        this.isMatchFailed = false;
        this.isProcessingMatch = true;
        // TODO: Add API request to retry matching.
    }

    onMatchDialogClose() {
        this.isProcessingMatch = false;
    }

    onRetryMatchDialogClose() {
        this.isMatchFailed = false;
    }

    removeTopic(index: number) {
        if (this.userCriteria.topics == null) {
            return;
        }
        this.userCriteria.topics = [
            ...this.userCriteria.topics.slice(0, index),
            ...this.userCriteria.topics.slice(index + 1),
        ];
    }
}
