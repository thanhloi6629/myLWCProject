/**
 * This class contains unit tests for validating the behavior of Apex classes
 * and triggers.
 *
 * Unit tests are class methods that verify whether a particular piece
 * of code is working properly. Unit test methods take no arguments,
 * commit no data to the database, and are flagged with the testMethod
 * keyword in the method definition.
 *
 * All test methods in an org are executed whenever Apex code is deployed
 * to a production org to confirm correctness, ensure code
 * coverage, and prevent regressions. All Apex classes are
 * required to have at least 75% code coverage in order to be deployed
 * to a production org. In addition, all triggers must have some code coverage.
 * 
 * The @isTest class annotation indicates this class only contains test
 * methods. Classes defined with the @isTest annotation do not count against
 * the org size limit for all Apex scripts.
 *
 * See the Apex Language Reference for more information about Testing and Code Coverage.
 */
@isTest
private class StudentTriggerHandlerTest {
    @TestSetup
    static void setupData(){
      List<Grade__c> grades = new List<Grade__c>();
      for (Integer i = 0; i < 10; i++) {
      grades.add(new Grade__c(Name = 'Grade ' + i));
      }
      insert grades;

      // Tạo dữ liệu mẫu cho Student__c
      List<Student__c> students = new List<Student__c>();
      for (Integer i = 0; i < 10; i++) {
        students.add(
          new Student__c(
            Name = 'Student First Name Last Name ' + i,
            firstName__c = 'First Name ' + i,
            lastName__c = 'Last Name ' + i,
            birthday__c = Date.today().addYears(-10),
            diem1__c = 8 + Math.mod(i, 3),
            diem2__c = 7 + Math.mod(i, 4),
            diem3__c = 6 + Math.mod(i, 5),
            gender__c = Math.mod(i, 2) == 0 ? 'Nam' : 'Nữ',
            grade__c = grades[i].Id
          )
        );
      }
      insert students;
    }
    @isTest
    static void testValidateStudent() {
      Grade__c grade = [SELECT Id FROM Grade__c LIMIT 1];
      // Nhập ngày sinh
     
      Student__c student_Date = new Student__c(
        Name = 'Student First Name Last Name',
        firstName__c = 'First Name',
        lastName__c = 'Last Name',
        birthday__c = null,
        diem1__c = 8,
        diem2__c = 7,
        diem3__c = 6,
        grade__c = grade.Id
      );

      // case 1: Nhập tuổi < 6
      Student__c student_Date_Min = new Student__c(
        Name = 'Student First Name Last Name',
        firstName__c = 'First Name',
        lastName__c = 'Last Name',
        birthday__c = Date.today().addYears(-5),
        diem1__c = 8,
        diem2__c = 7,
        diem3__c = 6,
        grade__c = grade.Id
      );


      // case: Nhập tuổi > 18
      Student__c student_Date_Max = new Student__c(
        Name = 'Student First Name Last Name',
        firstName__c = 'First Name',
        lastName__c = 'Last Name',
        birthday__c = Date.today().addYears(-19),
        diem1__c = 8,
        diem2__c = 7,
        diem3__c = 6,
        grade__c = grade.Id
      );

      // case: Nhập điểm môn Toán > 10
      Student__c student_Toan = new Student__c(
        Name = 'Student First Name Last Name',
        firstName__c = 'First Name',
        lastName__c = 'Last Name',
        birthday__c = Date.today().addYears(-10),
        diem1__c = 11,
        diem2__c = 7,
        diem3__c = 6,
        grade__c = grade.Id
      );


      // case: Nhập điểm môn Lý > 10
      Student__c student_Ly = new Student__c(
        Name = 'Student First Name Last Name',
        firstName__c = 'First Name',
        lastName__c = 'Last Name',
        birthday__c = Date.today().addYears(-10),
        diem1__c = 10,
        diem2__c = 11,
        diem3__c = 6,
        grade__c = grade.Id
      );

      // case: Nhập điểm môn Hóa > 10
      Student__c student_Hoa = new Student__c(
        Name = 'Student First Name Last Name',
        firstName__c = 'First Name',
        lastName__c = 'Last Name',
        birthday__c = Date.today().addYears(-10),
        diem1__c = 8,
        diem2__c = 7,
        diem3__c = 11,
        grade__c = grade.Id
      );
      

      Test.startTest();
        // insert student_Date;
        Database.SaveResult insert_student_Date = Database.insert(student_Date, false);
        Database.SaveResult insert_student_Date_Min = Database.insert(student_Date_Min, false);
        Database.SaveResult insert_student_Date_Max = Database.insert(student_Date_Max, false);
        Database.SaveResult insert_student_Toan = Database.insert(student_Toan, false);
        Database.SaveResult insert_student_Ly = Database.insert(student_Ly, false);
        Database.SaveResult insert_student_Hoa = Database.insert(student_Hoa, false);

      Test.stopTest();
      // theo document https://trailhead.salesforce.com/content/learn/modules/apex_testing/apex_testing_triggers
      System.assert(!insert_student_Date.isSuccess());
      System.assert(insert_student_Date.getErrors().size() > 0);
      System.assertEquals('Hãy nhập ngày sinh', insert_student_Date.getErrors()[0].getMessage());
      
      System.assert(!insert_student_Date_Min.isSuccess());
      System.assert(insert_student_Date_Min.getErrors().size() > 0);
      System.assertEquals('Tuổi của học sinh phải từ 6 đến 18.', insert_student_Date_Min.getErrors()[0].getMessage());
      
      System.assert(!insert_student_Date_Max.isSuccess());
      System.assert(insert_student_Date_Max.getErrors().size() > 0);
      System.assertEquals('Tuổi của học sinh phải từ 6 đến 18.', insert_student_Date_Max.getErrors()[0].getMessage());
      
      System.assert(!insert_student_Toan.isSuccess());
      System.assert(insert_student_Toan.getErrors().size() > 0);
      System.assertEquals('Hãy nhập điểm môn Toán nhỏ hơn 10', insert_student_Toan.getErrors()[0].getMessage());
      
      System.assert(!insert_student_Ly.isSuccess());
      System.assert(insert_student_Ly.getErrors().size() > 0);
      System.assertEquals('Hãy nhập điểm môn Lý nhỏ hơn 10', insert_student_Ly.getErrors()[0].getMessage());

      System.assert(!insert_student_Hoa.isSuccess());
      System.assert(insert_student_Hoa.getErrors().size() > 0);
      System.assertEquals('Hãy nhập điểm môn Hóa nhỏ hơn 10', insert_student_Hoa.getErrors()[0].getMessage());

    }
}