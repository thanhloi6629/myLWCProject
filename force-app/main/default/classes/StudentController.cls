public with sharing class StudentController {
    @AuraEnabled
    public static List<Student__c> getStudents() {
        return [SELECT code__c, firstName__c, lastName__c , status__c, diem1__c, diem2__c, diem3__c, diemTB__c, gender__c, Name, grade__c FROM Student__c];
    }
}