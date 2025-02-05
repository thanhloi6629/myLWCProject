trigger StudentTrigger on Student__c (before insert, before update, after insert, after update) {
    // Chạy cả insert va update
    if(Trigger.isBefore && (Trigger.isInsert || Trigger.isUpdate)) {
        StudentTriggerHandler.validateStudent(Trigger.new);
    }

    if(Trigger.isAfter && (Trigger.isInsert || Trigger.isUpdate)) {
        // Chỉ chạy sau khi insert hoặc update
        StudentTriggerHandler.updateGrade(Trigger.new, Trigger.oldMap);
    }
       
    // if (Trigger.isInsert) {
    //     // Chỉ chạy khi insert
    // } else if (Trigger.isUpdate) {
    //     // Chỉ chạy khi update
    // }
}