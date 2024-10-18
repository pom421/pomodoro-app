import React, { useReducer, useEffect, useCallback, useRef } from 'react';
import { Timer, Pause, Play, Coffee, Settings2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

type TimerState = 'work' | 'break' | 'idle';

interface State {
  taskName: string;
  isTaskCompleted: boolean;
  isTaskEditing: boolean;
  workDuration: number;
  breakDuration: number;
  timeLeft: number;
  isRunning: boolean;
  timerState: TimerState;
}

type Action =
  | { type: 'SET_TASK_NAME'; payload: string }
  | { type: 'TOGGLE_TASK_COMPLETED' }
  | { type: 'SET_TASK_EDITING'; payload: boolean }
  | { type: 'SET_WORK_DURATION'; payload: number }
  | { type: 'SET_BREAK_DURATION'; payload: number }
  | { type: 'SET_TIME_LEFT'; payload: number }
  | { type: 'TOGGLE_TIMER' }
  | { type: 'TICK' }
  | { type: 'SWITCH_TO_BREAK' }
  | { type: 'SWITCH_TO_WORK' }
  | { type: 'RESET_TIMER' };

const initialState: State = {
  taskName: '',
  isTaskCompleted: false,
  isTaskEditing: false,
  workDuration: 25,
  breakDuration: 5,
  timeLeft: 25 * 60,
  isRunning: false,
  timerState: 'idle'
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_TASK_NAME':
      return { ...state, taskName: action.payload };
    case 'TOGGLE_TASK_COMPLETED':
      return { ...state, isTaskCompleted: !state.isTaskCompleted };
    case 'SET_TASK_EDITING':
      return { ...state, isTaskEditing: action.payload };
    case 'SET_WORK_DURATION':
      return {
        ...state,
        workDuration: action.payload,
        timeLeft: state.timerState === 'idle' ? action.payload * 60 : state.timeLeft
      };
    case 'SET_BREAK_DURATION':
      return { ...state, breakDuration: action.payload };
    case 'SET_TIME_LEFT':
      return { ...state, timeLeft: action.payload };
    case 'TOGGLE_TIMER':
      return {
        ...state,
        isRunning: !state.isRunning,
        timerState: state.timerState === 'idle' ? 'work' : state.timerState
      };
    case 'TICK':
      return { ...state, timeLeft: state.timeLeft - 1 };
    case 'SWITCH_TO_BREAK':
      return { ...state, timerState: 'break', timeLeft: state.breakDuration * 60 };
    case 'SWITCH_TO_WORK':
      return { ...state, timerState: 'idle', timeLeft: state.workDuration * 60, isRunning: false };
    case 'RESET_TIMER':
      return { ...state, timerState: 'idle', timeLeft: state.workDuration * 60, isRunning: false };
    default:
      return state;
  }
}

const PomodoroTimer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const taskInputRef = useRef<HTMLInputElement>(null);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleTimer = useCallback(() => { 
    dispatch({ type: 'TOGGLE_TIMER' });
  }, []);

  const handleTaskInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      dispatch({ type: 'SET_TASK_EDITING', payload: false });
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "p") {
        event.preventDefault();
        toggleTimer();
      }
      
      if (
        event.key.toLowerCase() === 't' && 
        !state.isTaskEditing && 
        document.activeElement?.tagName !== 'INPUT'
      ) {
        event.preventDefault();
        dispatch({ type: 'SET_TASK_EDITING', payload: true });
        taskInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleTimer, state.isTaskEditing]);

  useEffect(() => {
    let interval: number;

    if (state.isRunning && state.timeLeft > 0) {
      interval = window.setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    } else if (state.timeLeft === 0) {
      if (state.timerState === 'work') {
        dispatch({ type: 'SWITCH_TO_BREAK' });
      } else if (state.timerState === 'break') {
        dispatch({ type: 'SWITCH_TO_WORK' });
      }
    }

    return () => clearInterval(interval);
  }, [state.isRunning, state.timeLeft, state.timerState]);

  const getProgressPercent = () => {
    const totalSeconds = state.timerState === 'work' ? state.workDuration * 60 : state.breakDuration * 60;
    return ((totalSeconds - state.timeLeft) / totalSeconds) * 100;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Pomodoro Timer</CardTitle>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings2 className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Timer Settings</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                  <div className="space-y-2">
                    <Label>Work Duration (minutes)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={state.workDuration}
                      onChange={(e) => dispatch({ type: 'SET_WORK_DURATION', payload: Number(e.target.value) })}
                      disabled={state.isRunning}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Break Duration (minutes)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={state.breakDuration}
                      onChange={(e) => dispatch({ type: 'SET_BREAK_DURATION', payload: Number(e.target.value) })}
                      disabled={state.isRunning}
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <CardDescription>
            Press 'p' to play or pause
            <br />
            Press 't' to edit task
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Checkbox
              checked={state.isTaskCompleted}
              onCheckedChange={() => dispatch({ type: 'TOGGLE_TASK_COMPLETED' })}
            />
            <div className="flex-1">
              {state.isTaskEditing ? (
                <Input
                  ref={taskInputRef}
                  type="text"
                  value={state.taskName}
                  onChange={(e) => dispatch({ type: 'SET_TASK_NAME', payload: e.target.value })}
                  onBlur={() => dispatch({ type: 'SET_TASK_EDITING', payload: false })}
                  onKeyDown={handleTaskInputKeyDown}
                  autoFocus
                  className="text-lg"
                />
              ) : (
                <div
                  onClick={() => dispatch({ type: 'SET_TASK_EDITING', payload: true })}
                  className={`text-lg px-3 py-2 rounded cursor-text ${
                    state.isTaskCompleted ? 'line-through text-gray-500' : ''
                  }`}
                >
                  {state.taskName || 'Click to add task (or press "t")'}
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            <div 
              className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={getProgressPercent()}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div 
                className="h-full transition-all duration-1000 ease-linear"
                style={{ 
                  width: `${getProgressPercent()}%`,
                  backgroundColor: state.timerState === 'work' ? 'rgb(34, 197, 94)' : 'rgb(59, 130, 246)'
                }}
              />
            </div>
          </div>

          <div className="text-center space-y-4">
            <div className="text-7xl font-mono font-bold tracking-wider">
              {formatTime(state.timeLeft)}
            </div>
            
            <div className="flex items-center justify-center gap-2">
              <Badge variant={state.timerState === 'work' ? 'destructive' : 'default'}>
                {state.timerState === 'work' ? (
                  <><Timer className="w-4 h-4 mr-2" /> Focus Time</>
                ) : state.timerState === 'break' ? (
                  <><Coffee className="w-4 h-4 mr-2" /> Break Time</>
                ) : (
                  'Ready'
                )}
              </Badge>
            </div>

            <Button 
              onClick={toggleTimer}
              size="lg"
              variant={state.isRunning ? "destructive" : "default"}
              className="w-40 transition-all duration-200"
            >
              {state.isRunning ? (
                <><Pause className="w-4 h-4 mr-2" /> Pause</>
              ) : (
                <><Play className="w-4 h-4 mr-2" /> Start</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PomodoroTimer;