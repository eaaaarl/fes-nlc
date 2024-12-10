"use client"

import React, { useEffect, useState } from 'react'
import { PageWithBackButton } from '../../../_components/PageWithBackButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { studentEditSchema, studentEditValues } from '@/lib/validation'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Check, Loader2, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'

export function StudentEditSkeleton() {
    return (
        <PageWithBackButton
            backButtonHref='/admin/students'
            pageTitle='Edit Students'
        >
            <div className='space-y-6 max-w-2xl mx-auto'>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <Skeleton className="h-8 w-1/2" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-[150px]" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-[100px]" />
                                    <Skeleton className="h-12 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-[100px]" />
                                    <Skeleton className="h-12 w-full" />
                                </div>
                            </div>
                            <div>
                                <Skeleton className="h-12 w-[120px]" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PageWithBackButton>
    )
}

interface StudentEditPayload {
    id: string;
    fullName: string;
    department: string;
    subjects: {
        id: string;
        subjectName: string
    }[]
}

type Subject = { id: string, subjectName: string };

export default function page() {
    const params = useParams<{ id: string }>()
    const id = params.id;
    const [currentSelectedSubject, setCurrentSelectedSubject] = useState('');
    const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([])

    const form = useForm({
        resolver: zodResolver(studentEditSchema),
        defaultValues: {
            fullName: "",
            department: "",
            subjectIds: []
        }
    })

    const { data: getStudent, isLoading: getStudentLoading } = useQuery({
        queryKey: ['student', 'edit', id],
        queryFn: async (): Promise<StudentEditPayload> => {
            const response = await fetch(`/api/admin/student/${id}/edit`)
            if (!response.ok) {
                const err = await response.json()
                throw new Error(err.error || 'Failed to get the student')
            }
            return response.json()
        },
        enabled: !!id
    })

    useEffect(() => {
        if (getStudent) {

            form.reset({
                fullName: getStudent.fullName,
                department: getStudent?.department || form.getValues('department') || 'CITE',
            });

            const existingSubjects = getStudent?.subjects?.map(subject => ({
                id: subject.id.toString(),
                subjectName: subject.subjectName
            })) || [];
            setSelectedSubjects(existingSubjects);
        }
    }, [getStudent, form, setSelectedSubjects]);

    const { data: subjects, isLoading } = useQuery({
        queryKey: ['subject', 'all'],
        queryFn: async (): Promise<{ id: string, subjectName: string }[]> => {
            const response = await fetch(`/api/admin/getSubject`);
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to get subjects')
            }
            return response.json()
        }
    });




    const handleSubjectSelection = (subjectId: string) => {
        const subject = subjects?.find(s => s.id === subjectId)
        if (subject) {
            setSelectedSubjects(prev => {
                const isAlreadySelected = prev.some(s => s.id === subjectId)
                if (isAlreadySelected) {
                    return prev.filter(s => s.id !== subjectId)
                } else {
                    return [...prev, subject];
                }
            })
            setCurrentSelectedSubject(subject.id);
        }
    }

    useEffect(() => {
        if (selectedSubjects) {
            form.setValue('subjectIds', selectedSubjects.map(s => s.id.toString()), {
                shouldValidate: true
            });
        }
    }, [selectedSubjects, form]);



    const handleSubmit = (payload: studentEditValues) => {
        console.log(payload)
    }

    if (getStudentLoading || isLoading) {
        return <StudentEditSkeleton />
    }

    console.log(form.getValues('department'))
    return (
        <PageWithBackButton
            backButtonHref='/admin/students'
            pageTitle='Edit Students'
        >
            <div className='space-y-6 max-w-2xl mx-auto'>
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Student</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name='subjectIds'
                                        render={() => (
                                            <FormItem>
                                                <FormLabel>Select Subjects</FormLabel>
                                                <FormControl>
                                                    <div>
                                                        <Select
                                                            value={currentSelectedSubject}
                                                            onValueChange={handleSubjectSelection}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder='Select Subjects' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <ScrollArea className="h-72">
                                                                    <SelectGroup>
                                                                        {subjects?.map((subject) => (
                                                                            <SelectItem
                                                                                key={subject.id}
                                                                                value={subject.id}
                                                                            >
                                                                                <div className="flex items-center justify-between w-full">
                                                                                    <span>{subject.subjectName}</span>
                                                                                    {selectedSubjects.some(s => s.id === subject.id) && (
                                                                                        <Check className="h-4 w-4 text-green-500 ml-2" />
                                                                                    )}
                                                                                </div>
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectGroup>
                                                                </ScrollArea>
                                                            </SelectContent>
                                                        </Select>
                                                        <div className="mt-2 flex flex-wrap gap-2">
                                                            {selectedSubjects.map((subject) => (
                                                                <Badge
                                                                    key={subject.id}
                                                                    variant="secondary"
                                                                    className="flex items-center"
                                                                >
                                                                    {subject.subjectName}
                                                                    <X
                                                                        className="h-3 w-3 ml-1 cursor-pointer"
                                                                        onClick={() => handleSubjectSelection(subject.id)}
                                                                    />
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className='grid md:grid-cols-2 gap-4'>
                                    <FormField
                                        control={form.control}
                                        name='fullName'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder='Enter full name'
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='department'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Department</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={(value) => field.onChange(value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder='Select Department' />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                {['CITE'].map((dept) => (
                                                                    <SelectItem key={dept} value={dept}>
                                                                        {dept}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className='flex justify-start'>
                                    <Button
                                        type='submit'
                                        className='min-w-[120px]'
                                        disabled={status === 'pending'}
                                    >
                                        {status === 'pending' ? (<Loader2 className='h-4 w-4 animate-spin' />) : 'Save'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </PageWithBackButton>
    )
}
