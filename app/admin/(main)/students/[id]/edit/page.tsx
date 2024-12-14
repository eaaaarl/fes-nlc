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
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { useEditStudent } from './mutation'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import StudentEditSkeleton from './_components/StudentEditSkeleton'


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

export default function StudentPage() {
    const router = useRouter()
    const params = useParams<{ id: string }>()
    const id = params.id;
    const [currentSelectedSubject, setCurrentSelectedSubject] = useState('');
    const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([])



    const queryClient = useQueryClient()

    useEffect(() => {
        if (id) {
            queryClient.prefetchQuery({
                queryKey: ['student', 'edit', id],
                queryFn: async (): Promise<StudentEditPayload> => {
                    const response = await fetch(`/api/admin/student/${id}/edit`)
                    if (!response.ok) {
                        const err = await response.json()
                        throw new Error(err.error || 'Failed to get the student')
                    }
                    return response.json()
                }
            })
        }
    }, [id, queryClient])

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

    const form = useForm({
        resolver: zodResolver(studentEditSchema),
        defaultValues: {
            fullName: '',
            department: "CITE",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            subjectIds: [] as any
        }
    })

    useEffect(() => {
        if (getStudent) {

            form.reset({
                fullName: getStudent.fullName,
                department: getStudent.department,
            });

            const existingSubjects = getStudent?.subjects?.map(subject => ({
                id: subject.id,
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
            form.setValue('subjectIds', selectedSubjects.map(s => String(s.id)), {
                shouldValidate: true
            });
        }
    }, [selectedSubjects, form]);

    const { mutate, status } = useEditStudent()
    const handleSubmit = (payload: studentEditValues) => {
        mutate({ id, payload }, {
            onSuccess: () => {
                form.reset({
                    fullName: '',
                    department: "",
                    subjectIds: []
                })
                setCurrentSelectedSubject('')
                setSelectedSubjects([])

                router.push('/admin/students')
            }
        })
    }

    if (getStudentLoading || isLoading) {
        return <StudentEditSkeleton />
    }

    return (
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">
                                    STUDENTS
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>EDIT STUDENTS FORM</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>

            <div className='p-4'>
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
            </div>
        </SidebarInset>
    )
}
