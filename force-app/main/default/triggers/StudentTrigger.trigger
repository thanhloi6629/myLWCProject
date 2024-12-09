trigger StudentTrigger on Student__c (before insert, before update) {
    if(Trigger.isBefore) {
        StudentTriggerHandler.validateStudent(Trigger.new);
    }
}