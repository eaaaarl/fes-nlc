"use client"

import React, { useEffect, useState } from 'react'
import { PageWithBackButton } from '../../_components/PageWithBackButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { studentSchema, studentValues } from '@/lib/validation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select } from '@radix-ui/react-select'
import { SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useQuery } from '@tanstack/react-query'
import { Check, Loader, Loader2, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCreate } from './mutation'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'


export default function AddStudentForm() {

    const [currentSelectedSubject, setCurrentSelectedSubject] = useState('');
    const [selectedSubjects, setSelectedSubjects] = useState<{ id: string, subjectName: string }[]>([])

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

    const form = useForm({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            studentId: '',
            fullName: '',
            department: '',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            subjectIds: [] as any
        }
    })

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

    const { mutate, status } = useCreate();

    const handleSubmit = (payload: studentValues) => {
        console.log(payload)
        mutate(payload, {
            onSuccess: () => {
                form.reset({
                    fullName: '',
                    department: '',
                })
                setSelectedSubjects([]);
                setCurrentSelectedSubject('');
            }
        })
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
                                <BreadcrumbPage>ADD STUDENTS FORM</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>

            <div className='p-4'>
                <PageWithBackButton
                    backButtonHref="/admin/students"
                    pageTitle='Add Students'
                >
                    <div className='space-y-6 max-w-2xl mx-auto'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Student Registration Form</CardTitle>
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
                                                                        {isLoading ? (<Loader className='h-4 w-4 animate-spin' />) : (
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
                                                                        )}
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
                                        <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                                            <FormField
                                                control={form.control}
                                                name='studentId'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Student Id</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder='2024-00000'
                                                            />
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
