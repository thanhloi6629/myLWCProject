public with sharing class StudentController {
  @AuraEnabled
  public static List<Student__c> getStudents() {
    return [
      SELECT
        Id,
        code__c,
        Name,
        firstName__c,
        lastName__c,
        status__c,
        diem1__c,
        diem2__c,
        diem3__c,
        diemTB__c,
        gender__c,
        birthday__c,
        grade__c
      FROM Student__c
    ];
  }

  @AuraEnabled
  public static List<Grade__c> getGrades() {
      return [
        SELECT
          Id,
          Name
        FROM Grade__c
      ];
  }

  @AuraEnabled
  public static String addStudentV2(Map<String, Object> studentData) {
      System.debug('fields: ' + studentData);
    try {
      String grade = (String) studentData.get('grade');
      Grade__c  gradeRecord  = [SELECT Id FROM Grade__c WHERE code__c = :grade LIMIT 1];

      Student__c student = new Student__c(
        Name = (String) studentData.get('Name'),
        firstName__c =  (String) studentData.get('firstName__c'),
        lastName__c = (String) studentData.get('lastName__c'),
        birthday__c = studentData.containsKey('birthday__c') ? (Date) studentData.get('birthday__c') : null,
        diem1__c = studentData.containsKey('diem1__c') ? (Decimal) studentData.get('diem1__c') : null,
        diem2__c = studentData.containsKey('diem2__c') ? (Decimal) studentData.get('diem2__c') : null,
        diem3__c = studentData.containsKey('die3__c') ? (Decimal) studentData.get('diem3__c') : null,
        gender__c = (String) studentData.get('gender'),
        grade__c = gradeRecord.Id
      );
      System.debug('student: ' + student);
      insert student;
      return student.Id;
    } catch(Exception e) {
      System.debug(e.getMessage());
      return null;
    }
  }

  @AuraEnabled
  public static String addStudent(
    String name,
    String firstName,
    String lastName,
    Date birthday,
    Decimal diem1,
    Decimal diem2,
    Decimal diem3,
    String gender,
    String grade
  ) {
    try {
      Grade__c  gradeRecord  = [SELECT Id FROM Grade__c WHERE Id = :grade LIMIT 1];
      System.debug('gradeRecord: ' + gradeRecord);
      Student__c student = new Student__c(
        name = name,
        firstName__c = firstName,
        lastName__c = lastName,
        birthday__c = birthday,
        diem1__c = diem1,
        diem2__c = diem2,
        diem3__c = diem2,
        gender__c = gender,
        grade__c = gradeRecord.Id
      );

      insert student;
      System.debug('data inserted: ' + student.Id);
      return student.Id;
    } catch (Exception e) {
      // Ghi log lỗi và ném Exception để xử lý ở frontend
      System.debug('Error: ' + e.getMessage());
      throw new AuraHandledException(e.getMessage());
    }
  }
  
  @AuraEnabled
  public static String editStudent(
    String id,
    String name,
    String firstName,
    String lastName,
    Date birthday,
    Decimal diem1,
    Decimal diem2,
    Decimal diem3,
    String gender,
    String grade
  ) {
    try {
      System.debug('name: ' + name);
      Student__c student = [SELECT Id FROM Student__c WHERE Id = :id LIMIT 1];
        student.Name = name;
        student.firstName__c = firstName;
        student.lastName__c = lastName;
        student.birthday__c = birthday;
        student.diem1__c = diem1;
        student.diem2__c = diem2;
        student.diem3__c = diem2;
        student.gender__c = gender;
        student.grade__c = grade;

      update student;
      System.debug('data inserted: ' + student.Id);
      return student.Id;
    } catch (Exception e) {
      // Ghi log lỗi và ném Exception để xử lý ở frontend
      System.debug('Error: ' + e.getMessage());
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled
  public static string deleteStudent(String Id){
    try {
      Student__c student = [SELECT Id FROM Student__c WHERE Id = :Id LIMIT 1];
      delete student;
      return 'success';
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
