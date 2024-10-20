import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserCriteria } from '../user-criteria.model';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ChipModule } from 'primeng/chip';
import { CommonModule } from '@angular/common';
import { catchError, Observable, of, Subscription, switchMap, takeUntil, tap, timer } from 'rxjs';
import { MessageService } from 'primeng/api';
import { MatchService } from '../../../_services/match.service';
import { MatchResponse, MatchStatus } from '../match.model';

@Component({
    selector: 'app-finding-match',
    standalone: true,
    imports: [ChipModule, DialogModule, ButtonModule, ProgressSpinnerModule, CommonModule],
    templateUrl: './finding-match.component.html',
    styleUrl: './finding-match.component.css',
})
export class FindingMatchComponent {
    @Input() userCriteria!: UserCriteria;
    @Input() matchId!: string;
    @Input() isVisible = false;

    @Output() dialogClose = new EventEmitter<void>();
    @Output() matchFailed = new EventEmitter<void>();
    @Output() matchSuccess = new EventEmitter<void>();

    isFindingMatch = true;

    timeLeft!: number;
    interval!: NodeJS.Timeout;

    matchPoll!: Subscription;
    stopPolling$ = new EventEmitter();

    constructor(
        private matchService: MatchService,
        private messageService: MessageService,
    ) {}

    onMatchFailed() {
        this.stopTimer();
        this.matchFailed.emit();
    }

    onMatchSuccess() {
        this.stopTimer();
        this.isFindingMatch = false;
        this.matchSuccess.emit();
        // Possible to handle routing to workspace here.
    }

    onDialogShow() {
        this.startTimer(60);
        this.matchPoll = this.startPolling(5000).pipe(tap(), takeUntil(this.stopPolling$)).subscribe();
    }

    startPolling(interval: number): Observable<MatchResponse | null> {
        return timer(0, interval).pipe(switchMap(() => this.requestData()));
    }

    requestData() {
        return this.matchService.retrieveMatchRequest(this.matchId).pipe(
            tap((response: MatchResponse) => {
                console.log(response);
                const status: MatchStatus = response.data.status || MatchStatus.PENDING;
                switch (status) {
                    case MatchStatus.MATCH_FOUND:
                        this.onMatchSuccess();
                        break;
                    case MatchStatus.TIME_OUT:
                        this.stopPolling$.next(false);
                        this.onMatchFailed();
                        break;
                    // TODO: Add case for MatchStatus.COLLAB_CREATED
                }
            }),
            catchError(() => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Something went wrong while matching.`,
                    life: 3000,
                });
                this.closeDialog();
                return of(null);
            }),
        );
    }

    closeDialog() {
        this.stopTimer();
        this.matchPoll.unsubscribe();
        this.matchService.deleteMatchRequest(this.matchId).subscribe({
            next: response => {
                console.log(response);
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Something went wrong while cancelling your match.`,
                    life: 3000,
                });
            },
            complete: () => {
                this.dialogClose.emit();
            },
        });
    }

    startTimer(time: number) {
        this.timeLeft = time;
        this.interval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
            } else {
                this.stopTimer();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}
