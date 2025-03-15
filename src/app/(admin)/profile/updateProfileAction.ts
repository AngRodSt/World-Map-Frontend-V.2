'use server'

import { z } from 'zod'
import { update } from '@/actions/auth'

// Validation schema for updating a user profile
const updateProfileSchema = z.object({
    _id: z.string(),
    avatar: z.union([
        z.object({
            data: z.string(),
            contentType: z.string(),
        }),
        z.instanceof(File) // Allows either an object with data or a File instance
    ]).optional(),
    name: z.string().optional(),
    bio: z.string().optional(),
    phone: z.string().optional(),
    birthDate: z.union([z.date(), z.null()]).optional(),
    profession: z.string().optional()
})

// Handles profile update request
export async function handleUpdateProfile(prevState: unknown, formData: FormData, _id: string) {
    const name = formData.get('name') as string
    const avatar = formData.get('avatar') as File
    const bio = formData.get('bio') as string
    const phone = formData.get('phone') as string
    const date = formData.get('date') as string
    const profession = formData.get('profession') as string

    const birthDate = date ? new Date(date) : null
    
    // Validate input data
    const result = updateProfileSchema.safeParse({ _id, name, avatar, bio, phone, birthDate, profession })
    if (!result.success) {
        return {
            success: false,
            user: null,
            error: result.error.errors[0].message
        };
    }

    // Prepare FormData for API request
    const updatedFormData = new FormData()
    updatedFormData.append("_id", _id);
    if (name) updatedFormData.append("name", name);
    if (avatar.size !== 0) updatedFormData.append("avatar", avatar);
    if (bio) updatedFormData.append("bio", bio);
    if (phone) updatedFormData.append("phone", phone);
    if (birthDate) updatedFormData.append("date", birthDate.toISOString());
    if (profession) updatedFormData.append("profession", profession);

    const resultUpdate = await update(updatedFormData)
    if (!resultUpdate) {
        return { success: false, user: null, error:'Updated Fail'};
    }
    const { user, error } = resultUpdate;
    if (error) {
        return { success: false, user: null, error: error };
       
    }
    else {
        return { success: true, user: user, error: null };
        
    }

}