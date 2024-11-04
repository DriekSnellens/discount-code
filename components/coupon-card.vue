<script setup lang="ts">
import { DiscountType, type Discount } from '@/types/index';
const emit = defineEmits(['deleteCoupon'])
const props = defineProps<Discount>();

const showActive = computed(() => {
    const currentDate = new Date().getTime();
    const isActive = currentDate >= new Date(props.valid_from).getTime();

    if(props.valid_until) {
        return isActive && currentDate <= new Date(props.valid_until).getTime();
    }

    return isActive;
})
const showExpired = computed(() => {
    const currentDate = new Date().getTime();
    if(!props.valid_until) {
        return false;
    }
    return currentDate >= new Date(props.valid_until).getTime();
})

const discountValue = computed(() => {
    switch (props.discount_type_id) {
        case DiscountType.PRICE:
            return `€${props.discount_value}`;
        default:
            return `${props.discount_value}%`;
    }   
})
</script>

<template>
<div class="flex flex-col min-w-[295px] border border-[#0000003B] rounded">
    <NuxtLink :to="'/manage/' + props.id">
        <div class="h-[186px]">
        <div class="flex flex-col px-10 py-12">
            <div class="border-dotted items-center rounded border-2 self-center border-[#0000005C] px-6 w-fit max-w-[217px] text-[27px] bg-[#D5D5D5]">
                {{ props.code }}
            </div>
            <div class="mt-6 flex flex-row items-center justify-evenly">
                <template v-if="showExpired">
                    <div  class="py-[5px] px-2.5 bg-[#D80000] bold w-fit text-xs rounded-xl items-center text-white">
                        VERLOPEN
                    </div>
                </template>
                <template v-else >
                    <div v-if="showActive" class="py-[5px] px-2.5 bg-[#64D800] text-xs bold w-fit rounded-xl items-center text-white">
                        ACTIEF
                    </div>
                    <span v-else>{{ props.valid_from }}</span>
                    <template v-if="props.valid_until">
                        <span class="bold"> tot </span> 
                    </template>
                    <span v-if="props.valid_until"> 
                        {{ props.valid_until }}
                    </span>
                </template>
              
            </div>
        </div>
    </div>
    </NuxtLink>
    <div class="h-[75px] bg-[#DADADA]">
        <div class="flex flex-row justify-between items-center p-[17px]">
            <div class="flex flex-col">
                <span class="text-base font-black">{{props.title}}</span>
                <span class="text-sm opacity-[71%]">{{ discountValue }} Korting</span>
            </div>
            <i @click="emit('deleteCoupon', props.id)" class="fa-solid fa-trash hover:cursor-pointer"></i>
        </div>
    </div>
</div>
</template>