// src\utils\validations.js
/**
 * Validation Schemas
 * Schemas قابلة لإعادة الاستخدام للتحقق من البيانات
 */

import { z } from 'zod'

/**
 * Common validation rules
 */
export const commonValidations = {
    name: (min = 3, max = 100) => z.string()
        .min(min, `الاسم يجب أن يكون ${min} أحرف على الأقل`)
        .max(max, `الاسم طويل جداً (الحد الأقصى ${max} حرف)`),
    
    phone: z.string()
        .regex(/^\d+$/, 'رقم الهاتف يجب أن يكون أرقام فقط')
        .min(6, 'رقم الهاتف يجب أن يكون 6 أرقام على الأقل')
        .max(15, 'رقم الهاتف طويل جداً'),
    
    username: (min = 3, max = 50) => z.string()
        .min(min, `اسم المستخدم يجب أن يكون ${min} أحرف على الأقل`)
        .max(max, `اسم المستخدم طويل جداً (الحد الأقصى ${max} حرف)`)
        .regex(/^[a-zA-Z0-9_]+$/, 'اسم المستخدم يمكن أن يحتوي على أحرف إنجليزية وأرقام و_ فقط'),
    
    password: (min = 6, max = 50, required = true) => {
        const schema = z.string()
            .min(min, `كلمة المرور يجب أن تكون ${min} أحرف على الأقل`)
            .max(max, `كلمة المرور طويلة جداً (الحد الأقصى ${max} حرف)`)
            .regex(/[A-Z]/, 'كلمة المرور يجب أن تحتوي على حرف كبير على الأقل')
            .regex(/[a-z]/, 'كلمة المرور يجب أن تحتوي على حرف صغير على الأقل')
            .regex(/[0-9]/, 'كلمة المرور يجب أن تحتوي على رقم على الأقل')
        
        return required ? schema : schema.optional().or(z.literal(''))
    },
    
    email: z.string()
        .email('البريد الإلكتروني غير صحيح')
        .optional()
        .or(z.literal('')),
    
    description: (max = 500) => z.string()
        .max(max, `الوصف طويل جداً (الحد الأقصى ${max} حرف)`)
        .optional()
        .or(z.literal('')),
    
    price: z.number()
        .min(0, 'السعر يجب أن يكون أكبر من أو يساوي 0')
        .optional(),
    
    quantity: z.number()
        .int('الكمية يجب أن تكون رقماً صحيحاً')
        .min(1, 'الكمية يجب أن تكون أكبر من 0')
        .optional(),
}

/**
 * User/Client validation schema
 */
export const createUserSchema = (isEdit = false) => z.object({
    name: commonValidations.name(),
    phone: commonValidations.phone,
    username: isEdit 
        ? commonValidations.username().optional().or(z.literal(''))
        : commonValidations.username(),
    password: commonValidations.password(6, 50, !isEdit),
})

/**
 * Staff validation schema
 */
export const createStaffSchema = (isEdit = false, allowedRoles = []) => z.object({
    name: commonValidations.name(),
    phone: commonValidations.phone,
    username: isEdit 
        ? commonValidations.username().optional().or(z.literal(''))
        : commonValidations.username(),
    password: commonValidations.password(6, 50, !isEdit),
    role: allowedRoles.length > 0
        ? z.enum(allowedRoles, { errorMap: () => ({ message: 'المنصب غير صحيح' }) })
        : z.string().min(1, 'المنصب مطلوب'),
}) 

/**
 * Event validation schema
 */
export const createEventSchema = () => z.object({
    eventName: commonValidations.name(3, 200),
    eventType: z.string().min(1, 'نوع الفعالية مطلوب'),
    eventDate: z.string().min(1, 'تاريخ الفعالية مطلوب'),
    startTime: z.string().min(1, 'وقت البدء مطلوب'),
    endTime: z.string().min(1, 'وقت الانتهاء مطلوب'),
    guestCount: z.number().int().min(1, 'عدد الضيوف يجب أن يكون أكبر من 0'),
    requiredEmployees: z.number().int().min(0, 'عدد الموظفين يجب أن يكون أكبر من أو يساوي 0').optional(),
    services: z.array(z.object({
        service: z.string().min(1, 'الخدمة مطلوبة'),
        quantity: z.number().int().min(1, 'الكمية يجب أن تكون أكبر من 0'),
        price: z.number().min(0, 'السعر يجب أن يكون أكبر من أو يساوي 0'),
    })).optional(),
    specialRequests: commonValidations.description(1000),
    clientSelection: z.enum(['existing', 'new']),
    clientId: z.string().optional(),
    clientName: z.string().optional(),
    clientusername: z.string().optional(),
    phone: z.string().optional(),
    password: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.clientSelection === 'new') {
        if (!data.clientName || data.clientName.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['clientName'],
                message: 'اسم العميل مطلوب',
            })
        }
        if (!data.clientusername || data.clientusername.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['clientusername'],
                message: 'اسم المستخدم مطلوب',
            })
        }
        if (!data.phone || data.phone.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['phone'],
                message: 'رقم الهاتف مطلوب',
            })
        }
        if (!data.password || data.password.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['password'],
                message: 'كلمة المرور مطلوبة',
            })
        }
    } else if (data.clientSelection === 'existing') {
        if (!data.clientId || data.clientId.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['clientId'],
                message: 'العميل مطلوب',
            })
        }
    }
})

/**
 * Template validation schema
 */
export const createTemplateSchema = () => z.object({
    templateName: commonValidations.name(1, 200),
    image: z.any().optional(),
})

/**
 * Hall validation schema
 */
export const createHallSchema = () => z.object({
    name: commonValidations.name(),
    description: commonValidations.description(1000),
    capacity: z.number().int().min(1, 'السعة يجب أن تكون أكبر من 0'),
    location: z.string().min(1, 'الموقع مطلوب'),
    price: commonValidations.price(),
})

