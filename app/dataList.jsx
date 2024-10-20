const prizeRangeList = [
    { id: 0, value:0 ,name: 'All Prizes'},
    { id: 1, value:1 ,name: 'USD50+'},
    { id: 2, value:2,name: 'USD500+' },
    { id: 3, value:3 ,name: 'USD1000+' },
    { id: 4, value:4 ,name: 'USD5000+'},
    { id: 5, value:5 ,name: 'USD10000+'},
  ]
  const defaultFormData = {
    id:'',
    title: '',
    category: '',
    description: '',
    startdate: null,
    mainPrize: '',
    deadline: null,
    prizeList: [null],
    judgeList: [null],
    winnerAnnouncement: null,
    entryFee: '',
    eligibility: '',
    submission: '',
    linkToPost: '',
    prizeRange: 0,
}
  const categoriesList = [
    { id: 0, value: '', name: 'All Categories' },
    { id: 1, value: 'Digital Arts', name: 'Digital Arts', colour:"blue-500" },
    { id: 2, value: 'Programming', name: 'Programming', colour:"green-500" },
    { id: 3, value: 'Writing', name: 'Writing', colour:"pink-600" },
    { id: 4, value: 'Videography', name: 'Videography' },
  ];
  
  // Generate categories string dynamically
  const categoriesString = categoriesList
    .filter(category => category.value) // Exclude 'All Categories' or empty values
    .map(category => category.name.toLowerCase()) // Convert to lowercase for prompt consistency
    .join(', ');
  
  // AI prompt with dynamic categories
const baseprompt ="Title={title} organizer={event organizer/sponsor/company} description={just describe the contest details in general, and mention stuffs that hasnt been mentioned in this prompt } MainPrize={mainPrize}, "
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
  
 const loremIpsum= `
                                What is Lorem Ipsum?
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

Why do we use it?
It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).


Where does it come from?
Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.

Where can I get some?
There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.


`
  
  export{prizeRangeList,defaultFormData, categoriesList, sortList, contestPromptAI, loremIpsum};