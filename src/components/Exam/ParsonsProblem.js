'use client';

import React, { useState, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DragOverlay,
    useDroppable,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useExam } from '../../context/ExamContext';
import MathRenderer from '../MathRenderer';
import clsx from 'clsx';

function SortableItem({ id, text, isOverlay }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={clsx(
                "p-3 mb-2 rounded-md border cursor-grab active:cursor-grabbing select-none",
                isOverlay ? "bg-blue-100 border-blue-500 shadow-lg" : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700"
            )}
        >
            <div className="font-mono text-sm text-zinc-800 dark:text-zinc-200">
                <MathRenderer text={text} />
            </div>
        </div>
    );
}

function DroppableContainer({ id, children, className, title, emptyText, borderColor }) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className={clsx(
                className,
                isOver ? "ring-2 ring-blue-400 ring-opacity-50 bg-blue-50/50 dark:bg-blue-900/20" : ""
            )}
        >
            <h4 className={clsx("text-sm font-medium mb-3 uppercase tracking-wider", borderColor === 'blue' ? "text-blue-600 dark:text-blue-400" : "text-zinc-500")}>
                {title}
            </h4>
            {children}
            {/* We handle empty state inside the children usually, but checking here is fine too if children is empty array */}
        </div>
    );
}

export default function ParsonsProblem({ question }) {
    const { answers, setAnswer } = useExam();

    const [items, setItems] = useState(() => {
        const savedAnswer = answers[question.id];
        if (savedAnswer && Array.isArray(savedAnswer) && savedAnswer.length > 0) {
            const solutionItems = savedAnswer.map(id => question.scrambled_code_blocks.find(b => b.id === id)).filter(Boolean);
            const solutionIds = new Set(savedAnswer);
            const availableItems = question.scrambled_code_blocks.filter(b => !solutionIds.has(b.id));
            return {
                available: availableItems,
                solution: solutionItems
            };
        }
        return {
            available: [...question.scrambled_code_blocks],
            solution: []
        };
    });

    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        const solutionIds = items.solution.map(item => item.id);
        setAnswer(question.id, solutionIds);
    }, [items.solution, question.id, setAnswer]);

    const findContainer = (id) => {
        if (items.available.find((item) => item.id === id)) return 'available';
        if (items.solution.find((item) => item.id === id)) return 'solution';
        return null;
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        const overId = over?.id;

        if (!overId || active.id === overId) return;

        const activeContainer = findContainer(active.id);
        const overContainer = (overId === 'available' || overId === 'solution')
            ? overId
            : findContainer(overId);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        setItems((prev) => {
            const activeItems = prev[activeContainer];
            const overItems = prev[overContainer];
            const activeIndex = activeItems.findIndex((item) => item.id === active.id);
            const overIndex = (overId === 'available' || overId === 'solution')
                ? overItems.length + 1
                : overItems.findIndex((item) => item.id === overId);

            let newIndex;
            if (overId === 'available' || overId === 'solution') {
                newIndex = overItems.length;
            } else {
                const isBelowOverItem =
                    over &&
                    active.rect.current.translated &&
                    active.rect.current.translated.top > over.rect.top + over.rect.height;

                const modifier = isBelowOverItem ? 1 : 0;
                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            return {
                ...prev,
                [activeContainer]: [
                    ...prev[activeContainer].filter((item) => item.id !== active.id),
                ],
                [overContainer]: [
                    ...prev[overContainer].slice(0, newIndex),
                    activeItems[activeIndex],
                    ...prev[overContainer].slice(newIndex, prev[overContainer].length),
                ],
            };
        });
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        const activeContainer = findContainer(active.id);
        const overContainer = over ? ((over.id === 'available' || over.id === 'solution') ? over.id : findContainer(over.id)) : null;

        if (
            activeContainer &&
            overContainer &&
            activeContainer === overContainer
        ) {
            const activeIndex = items[activeContainer].findIndex((item) => item.id === active.id);
            const overIndex = items[overContainer].findIndex((item) => item.id === over.id);

            if (activeIndex !== overIndex) {
                setItems((prev) => ({
                    ...prev,
                    [activeContainer]: arrayMove(prev[activeContainer], activeIndex, overIndex),
                }));
            }
        }

        setActiveId(null);
    };

    const activeItem = activeId
        ? [...items.available, ...items.solution].find((item) => item.id === activeId)
        : null;

    return (
        <div className="mb-8 p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                <span className="mr-2 text-orange-600 dark:text-orange-400">Q{question.id.replace('q', '')}.</span>
                <MathRenderer text={question.question_text} />
                <span className="ml-2 text-xs font-normal text-zinc-500 hidden sm:inline">(Drag blocks to Solution Area)</span>
                <span className="ml-2 text-xs font-normal text-zinc-500 sm:hidden">(Hold to drag)</span>
            </h3>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Available Pool */}
                    <DroppableContainer
                        id="available"
                        title="Code Pool"
                        className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 min-h-[200px]"
                    >
                        <SortableContext
                            id="available"
                            items={items.available.map((item) => item.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-2 min-h-[100px]">
                                {items.available.map((item) => (
                                    <SortableItem key={item.id} id={item.id} text={item.text} />
                                ))}
                                {items.available.length === 0 && (
                                    <div className="text-center text-zinc-400 text-sm py-8 italic">Empty</div>
                                )}
                            </div>
                        </SortableContext>
                    </DroppableContainer>

                    {/* Solution Area */}
                    <DroppableContainer
                        id="solution"
                        title="Solution Area"
                        borderColor="blue"
                        className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800 min-h-[200px]"
                    >
                        <SortableContext
                            id="solution"
                            items={items.solution.map((item) => item.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-2 min-h-[100px]">
                                {items.solution.map((item) => (
                                    <SortableItem key={item.id} id={item.id} text={item.text} />
                                ))}
                                {items.solution.length === 0 && (
                                    <div className="text-center text-blue-300 dark:text-blue-700 text-sm py-8 border-2 border-dashed border-blue-200 dark:border-blue-800 rounded">
                                        Drag blocks here
                                    </div>
                                )}
                            </div>
                        </SortableContext>
                    </DroppableContainer>
                </div>

                <DragOverlay>
                    {activeItem ? <SortableItem id={activeItem.id} text={activeItem.text} isOverlay /> : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
