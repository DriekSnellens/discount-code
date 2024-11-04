<script setup lang="ts">
  import { supabase } from '../utils/supabase'
  const discounts = ref();
  const search = ref();
  const sort = ref('title');
  const showExpired = ref(false);

  async function getDiscounts() {
    const baseQuery = supabase
        .from('discount')
        .select()
        .order(sort.value);

    let query = baseQuery;

    if (search.value) {
        query = query.or(`code.ilike.%${search.value}%, title.ilike.%${search.value}%`);
    }

    if (!showExpired.value) {
        query = query.or(`valid_until.gte.${new Date().toDateString()},valid_until.is.null`);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching discounts:', error);
    } else {
        discounts.value = data;
    }
}

  const handleDeleteCoupon = async (id:number) => {
    const { error } = await supabase
    .from('discount')
    .delete()
    .eq('id', id);

    getDiscounts();
  }

  onMounted(() => {
    getDiscounts();
  });
  
</script>

<template>
    <div>
        <div class="bg-[#EAEAEA] pl-[42px] pr-[47px] pt-[42px] flex flex-col gap-y-[26px] justify-start">
            <span class="text-[21px] leading-4 font-sans font-bold">Kortingscode overzicht</span>
            <span class="text-sm opacity-60 w-full xl:w-[678px]">In deze module kun je kortingscodes maken en zelf kiezen waar (potentiële) leden ze voor kunnen gebruiken. Bijvoorbeeld een kortingscode voor nieuwe leden die hun proefleskosten kunnen terugverdienen.</span>
            <div class="border-t border-[#7070705A] w-full">
                <div class="flex my-[26px] flex-row flex-wrap xl:flex-nowrap">
                    <select v-model="sort" class="border rounded min-w-[291px] max-h-14 px-[14px] py-[17px]" @change="getDiscounts" name="discount-type" id="discountType">
                            <option value="title">Sorteer op titel</option>
                            <option value="valid_from">Sorteer op geldigheid</option>
                    </select>
                    <div class="flex flex-row w-[407px] mt-[13px] md:mt-0 xl:mt-0">
                        <input v-model="search" placeholder="Zoek op trefwoord" class="border border-[#7070708B] max-h-14 p-[17px] md:ml-[13px] lg:ml-[13px] rounded-l min-w-[291px]" />
                        <div @click="getDiscounts" class="px-5 py-4 bg-[#FCCC2C] hover:cursor-pointer max-h-14 -ml-px min-w-[116px] text-sm content-center font-bold border border-l-0 border-[#7070708B] rounded-r">
                            <i class="fa-solid fa-search"></i><span class="ml-[7px]">Zoeken</span>
                        </div>
                    </div>
                    
                    <div class="flex w-full items-center justify-between mt-[13px] xl:mt-0">
                        <div class="xl:ml-11 self-center ">
                            <input v-model="showExpired" class="accent-black rounded hover:cursor-pointer" type="checkbox" id="showExpired" name="yes" value="yes" @change="getDiscounts">
                            <label class="ml-2.5 self-center hover:cursor-pointer" for="usageLimit">Toon <span class="underline">ook</span> inactieve kortingscodes</label>
                        </div>
                        <NuxtLink to="/manage/add">
                            <div class="p-[15px] hover:cursor-pointer bg-[#FCCC2C] max-h-14 flex flex-row items-center rounded self-end">
                                <i class="fa-solid fa-plus"></i><span class="ml-2.5 whitespace-nowrap">Nieuwe kortingscode</span>
                            </div>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="flex flex-row gap-3 mt-16 mx-9 flex-wrap justify-center md:justify-start">
            <CouponCard class="w-fit" v-for="discount in discounts" v-bind="discount" @deleteCoupon="handleDeleteCoupon" />
        </div>
    </div>  
</template> 