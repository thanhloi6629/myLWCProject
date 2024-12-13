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
private class StudentControllerTest {
  @TestSetup
  static void setupTestData() {
    // Tạo dữ liệu mẫu cho Grade__c
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

  @IsTest
  static void testSearchStudent() {
    Test.startTest();
    List<Student__c> students = StudentController.getStudents();
    Test.stopTest();
    System.assert(students.size() > 0, 'Get students failed');
  }
  @IsTest
  static void testGetStudentsPagination() {
    List<Student__c> student = [SELECT Id, Name FROM Student__c];
    System.debug('student: ' + student);
    Test.startTest();
    // Integer PageSize = 5;
    // Integer PageNumber = 1;
    // Integer paramPageNumber = (PageNumber - 1) * PageSize ;
    // * 1 lấy toàn bộ data
        System.assertEquals(10, student.size());
    // * 2. Truyền data: pageSize = 2, pageNumber = ((currentPage - 1) * PageSize), currentPage là trang click vào
        // case 2.1:  click trang đầu (pageSize = 2, pageNumber = 0 ) => output: totalRecords = 10, students.size = 2, totalPage = 5, 
        StudentController.PaginationStudent pagination = StudentController.getStudentsPagination(
            2,
            0,
            '', // name
            '', // grade
            '', // fromDate
            '', // toDate
            '', // sortField
            '' // sortOrder
            );
        System.AssertEquals(10, pagination.totalRecords);
        System.AssertEquals(2, pagination.students.size());
        System.AssertEquals(5, pagination.totalPage);
        // case 2.2:  click trang 2 (pageSize = 2, pageNumber = 2 ) => output: totalRecords = 10, students.size = 2, totalPage = 5, 
        StudentController.PaginationStudent pagination2 = StudentController.getStudentsPagination(
            2,
            2,
            '', // name
            '', // grade
            '', // fromDate
            '', // toDate
            '', // sortField
            '' // sortOrder
            );
        System.AssertEquals(10, pagination2.totalRecords);
        System.AssertEquals(2, pagination2.students.size());
        System.AssertEquals(5, pagination2.totalPage);
        // case 2.4:  click trang cuối (pageSize = 2, pageNumber = 10 ) => output: totalRecords = 10, students.size = 2, totalPage = 5
        StudentController.PaginationStudent pagination3 = StudentController.getStudentsPagination(
            2,
            8,
            '', // name
            '', // grade
            '', // fromDate
            '', // toDate
            '', // sortField
            '' // sortOrder
            );
        System.AssertEquals(10, pagination3.totalRecords);
        System.AssertEquals(2, pagination3.students.size());
        System.AssertEquals(5, pagination3.totalPage);

    // * 3. Truyền data: Search
            // case 3.1 lastName__c
        // case 3.1.1:  search lastName__c = '' 
        // case 3.1.2:  search lastName__c = 'nhập sai' 
        // case 3.1.3:  search lastName__c = 'Last Name 1' 
            // input: pageSize = 2, pageNumber = 0, name = 'Last Name 1' => output: totalRecords = 1, totalPage = 1
        // case 3.2:  search lastName__c = 'Last Name'
            // input: pageSize = 2, pageNumber = 0, name = 'Last Name' => output: totalRecords = 10, totalPage = 5

        // case 3.2: search fromDate 
             // 3.2.1 search fromDate = ''
             // 3.2.1 search fromDate = 'co gia tri'



        // case 3.3: search toDate
         // 3.3.1 search toDate = ''
        // 3.3.1 search toDate = 'co gia tri'


       // case 3.4: search fromDate ToDate

        // case 3.4.1 search fromDate = '', toDate = ''
         //  >= fromDate, <= toDate 
        
        
       
        // case 3.4: search Lớp

        Test.stopTest();
  }

  @IsTest
  static void testAddStudent() {
    Grade__c grade = [SELECT Id FROM Grade__c LIMIT 1];
    Test.startTest();
    String studentId = StudentController.addStudent(
      'Student 11',
      'First Name 11',
      'Last Name 11',
      Date.today().addYears(18),
      8,
      7,
      6,
      'Nam',
      grade.Id
    );
    Test.stopTest();
    System.assertNotEquals(null, StudentId, 'Add student failed');
    System.assert(studentId != null, 'Add student failed');
  }

  @IsTest
  static void testUpdateStudent() {
    Test.startTest();
    List<Student__c> students = StudentController.getStudents();
    Student__c student = students[0];

    String studentId = StudentController.editStudent(
      student.Id,
      'Update Name',
      'Update First Name',
      'Update Last Name',
      Date.today().addYears(-18),
      8,
      7,
      6,
      'Nam',
      student.grade__c
    );

    Test.stopTest();
    Student__c updatedStudent = [
      SELECT Id, Name
      FROM Student__c
      WHERE Id = :studentId
    ];
    System.assertEquals(
      'Student 0 Updated',
      updatedStudent.Name,
      'Update student was not failed'
    );
  }
}