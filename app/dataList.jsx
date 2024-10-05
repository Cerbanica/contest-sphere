const prizeRangeList = [
    { id: 0, value:0 ,name: 'All Prizes'},
    { id: 1, value:1 ,name: 'USD50+'},
    { id: 2, value:2,name: 'USD500+' },
    { id: 3, value:3 ,name: 'USD1000+' },
    { id: 4, value:4 ,name: 'USD5000+'},
    { id: 5, value:5 ,name: 'USD10000+'},
  ]
 
  const categoriesList = [
    { id: 0, value: '', name: 'All Categories' },
    { id: 1, value: 'Digital Arts', name: 'Digital Arts' },
    { id: 2, value: 'Programming', name: 'Programming' },
    { id: 3, value: 'Writing', name: 'Writing' },
    { id: 4, value: 'Videography', name: 'Videography' },
  ];
  
  // Generate categories string dynamically
  const categoriesString = categoriesList
    .filter(category => category.value) // Exclude 'All Categories' or empty values
    .map(category => category.name.toLowerCase()) // Convert to lowercase for prompt consistency
    .join(', ');
  
  // AI prompt with dynamic categories
const baseprompt ="Title={title} description={just describe the contest details in general, and mention stuffs that hasnt been mentioned in this prompt } MainPrize={mainPrize}, "
const categoryPrompt="choose a category from this list, use exact capitalization, first letter is <capped></capped>, eg if writing, then category=Writing:"+categoriesString;
const judgePrompt=" for each judge, make a judgeList=[judgeName@ and their link if available, else leave it empty], eg: judgeList=[judge1name @ www.something.com/judge1, judge2name@ judge2link,], if theres no judges, just put judgeList=[No judges @]"
const prizePrompt=`for prizes,  main Prize is mainPrize=mainPrize, and mainPrizeValue={estimate the mainPrize value in usd, google it fam, if it is in usd, just put the numbers}, for example, mainPrizeValue=700, for other prizes below that eg 2nd place etc, put   otherPrizes={other prizes and amount of winner per prizes, eg x2} 
and put the prizeCategoryList, eg: prizeCategoryList=[2nd place:prize x1#3rd place:prizex2# etc] use # as divider, ensure that theres :, as we need to separate label:value, if theres only 1 item, no need for the # divider` 
const datePrompt=" deadline={last day user can submit in dd/mm/yyyy} startDate={startDate in dd/mm/yyyy},  winnerAnnouncementDate={dd/mm/yyyy}, if theres no date mentioned, just put NA except for deadline, theres always deadline mentioned, if no year is mentioned, just put current year, google it fam what year is it now"
const miscellaneousPrompt="put entryFee=entryFee,includes any currency sign, eg, entryFee={$12} if theres no entry fee mentioned, just make entryFee=Free now for eligibility and submissionFormat, if not available, just put NA else do the same like entryFee"

const contestPromptAI=` describe the contest in this format and not json:`+baseprompt+judgePrompt+prizePrompt+datePrompt+miscellaneousPrompt+categoryPrompt;

  const contestPromptAI2 = `
  describe the contest in this format: 
  "Title={title} MainPrize={mainPrize} deadline={deadline in dd/mm/yyyy} 
  for each judge, make a judgeList=[judgeName@ and their link if available, else leave it empty], eg: judgeList=[judge1name @ www.something.com/judge1, judge2name@ judge2link,], if theres no judges, just put judgeList=[No judges @]
  for prizes,  main Prize is mainPrize=mainPrize, and mainPrizeValue={estimate the mainPrize value in usd, google it fam, if it is in usd, just put the numbers}, for example, mainPrizeValue=700, for other prizes below that eg 2nd place etc, put 
  and put the prizeCategoryList, eg: prizeCategoryList=[2nd place:prize x1#3rd place:prizex2# etc] use # as divider, ensure that theres :, as we need to separate label:value, if theres only 1 item, no need for the # divider" 
  do the same for the other details too, if not available, just put NA 
   otherPrizes={other prizes and amount of winner per prizes, eg x2} description={description} 
  choose a category from this list, use exact capitalization, eg if writing, then category=Writing:`+categoriesString;
  const sortList = [
    {id:1, value:'Latest',  name:'Latest'},
    {id:2, value:'Ending',  name:'Ending'}
  ]
  
 
  
  export{prizeRangeList, categoriesList, sortList, contestPromptAI};