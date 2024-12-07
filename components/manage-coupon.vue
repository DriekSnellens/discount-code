<script setup lang="ts">
  import { DiscountType } from '@/types/index';
  import { supabase } from '../utils/supabase';
  import type { PostgrestSingleResponse } from '@supabase/supabase-js';

  const discounts = ref();

  const props = defineProps<{ couponId?: string | string[]}>();

  const intializeForm = async () => {
    if(props.couponId) {
     const { data } = await supabase
     .from('discount')
     .select()
     .eq('id', parseInt(props.couponId as string)) as PostgrestSingleResponse<any>;
     console.log(data[0]);
     return ref( { ...data[0] } )
    } else {
        return ref({
            title : '',
            code : '',
            description : '',
            discount_type_id : DiscountType.PRICE,
            discount_value : 5,
            valid_from : '',
            valid_until : null,
            usage_limit : false,
            usage_count : 1
        })
    }
  }

  const formData = await intializeForm();  

  const discountText = computed(() => {
    return formData.value.discount_type_id === DiscountType.PRICE ? 'Bedrag' : 'Percentage'
  })

  async function getDiscounts() {
    const { data } = await supabase.from('discount').select();
    discounts.value = data;
  }

  const saveDiscount = async () => {
    if(props.couponId) {
        const { data, error } = await supabase
        .from('discount')
        .update(formData.value)
        .eq('id', props.couponId)
        .select()
    } else {
        const { data, error } = await supabase
        .from('discount')   
        .insert([
            formData.value,
        ])
        .select();
    }

    navigateTo('/');
  }

  onMounted(() => {
    getDiscounts();
  })
</script>

<template>
    <div>
        <div class="bg-[#EAEAEA] h-32 px-10 flex items-center justify-start">
            <div class="text-3xl leading-[34px] font-sans font-bold">Kortingscode toevoegen</div>
        </div>
        <div class="flex flex-col lg:flex-row mt-[42px] gap-8 px-[42px] w-full xl:w-fit pb-8">
            <div class="flex flex-col w-full xl:w-[479px]">
                <div class="flex h-[43.5px] border-b">
                    <i class="fa-solid text-[27px] fa-circle-info"></i>
                    <span class="ml-[19px] font-bold text-lg">Informatie</span>
                </div>
                <div class="mt-[42px] flex flex-col gap-y-2.5">
                    <div class="flex flex-row justify-between items-center">
                        <span>Titel</span>
                        <input v-model="formData.title" class="border p-[15px] rounded w-[291px] h-9" />
                    </div>
                    <div class="flex flex-row justify-between items-center">
                        <span>Code</span>
                        <input v-model="formData.code" class="border p-[15px] rounded w-[291px] h-9" />
                    </div>
                    <div class="flex flex-row justify-between items-center">
                        <span class="self-start">Omschrijving</span>
                        <textarea v-model="formData.description" rows="5" placeholder="Omschrijf hier de kortingsactie. Waar is de korting voor bedoeld?" 
                            class="border p-[15px] rounded w-[291px]" />
                    </div>
                </div>
            </div>
            <div class="flex flex-col w-full xl:w-[539px]">
                <div class="flex h-[43.5px] border-b">
                    <i class="text-[27px] fa-solid fa-sliders"></i>
                    <span class="ml-[19px] font-bold text-lg">Instellingen</span>
                </div>
                <div class="mt-[42px] flex flex-col p-[25px] rounded bg-[#E5E5E5] w-full xl:w-[539px]">
                    <div class="flex flex-row pb-[22px] border-b border-[#707070] justify-between items-center">
                        <span class="w-1/3 text-sm leading-4 font-bold">Type korting</span>
                        <select v-model="formData.discount_type_id" class="border rounded w-[291px] ml-9 h-9" name="discount-type" id="discountType">
                            <option value="1">Bedrag</option>
                            <option value="2">Percentage</option>
                        </select>
                    </div>
                    <div class="flex flex-row pb-[22px] mt-6 items-center">
                        <span class="w-1/3 text-sm leading-4 font-bold">{{ discountText }}</span>
                        <div class="ml-9 flex flex-row">
                            <input v-model="formData.discount_value" class="border text-center rounded w-[58px] h-9" />
                            <div v-if="formData.discount_type_id === DiscountType.PRICE">
                                ,
                                <input value="00" class="border text-center rounded w-[38px] h-9" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-[42px] flex flex-col p-[25px] gap-y-[25px] rounded bg-[#E5E5E5] w-full xl:w-[539px]">
                    <div class="flex flex-row items-center">
                        <span class="w-1/3 text-sm leading-4 font-bold">Geldig van datum</span>
                        <input v-model="formData.valid_from" type="date" class="border ml-9 rounded w-[291px] h-9" />
                    </div>
                    <div class="flex flex-row mt-2 items-center">
                        <div class=" w-1/3 flex flex-col">
                            <span class="text-sm leading-4 font-bold">Geldig tot datum</span>
                            <span>(Optioneel)</span>
                        </div>
                        <input v-model="formData.valid_until" type="date" class="border ml-9 rounded w-[291px] h-9" />
                    </div>
                </div>  
                <div class="mt-[42px] flex flex-col p-[25px] rounded bg-[#E5E5E5] w-full xl:w-[539px]">
                    <div class="flex flex-row items-center">
                        <span class="w-1/3 text-sm leading-4 font-bold">Maximumgebruik</span>
                        <div class="ml-9">
                            <input class="accent-black rounded" v-model="formData.usage_limit" type="checkbox" id="usageLimit" name="yes" value="yes">
                            <label class="ml-2.5" for="usageLimit">Ja</label>
                        </div>
                    </div>  
                    <div v-if="formData.usage_limit" class="flex flex-row mt-4 items-center">
                        <span class="w-1/3 text-sm leading-4 font-bold">Aantal keer te gebruiken</span>
                        <input v-model="formData.usage_count" type="number" min="1" class="border p-1 ml-9 rounded w-[54px]" />
                    </div>
                </div>
            </div>
        </div>
        <div class="flex mx-10 border-t py-4 flex-row">
            <NuxtLink to="/">
                <div class="rounded py-4 px-8 hover:cursor-pointer font-bold bg-[#DCDCDC]">
                    Annuleren
                </div>
            </NuxtLink>
            <div @click="saveDiscount()" class="rounded ml-[15px] hover:cursor-pointer py-4 px-8 font-bold bg-[#FCCC2C]">
                Opslaan
            </div>
        </div>
    </div>
</template> 