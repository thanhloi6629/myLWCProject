public with sharing class ContactController {
    @AuraEnabled
    public static List<Contact> updateContact() {
        List<Contact> updateList = new List<Contact>();
        List<Contact> listName =[Select Name, Phone from Contact];
        for( Contact variable : listName){
            variable.Name = 'Mr. ' + variable.Name;
            updateList.add(variable);
        }
        update updateList;
    }

    @AuraEnabled  
    public static string addContact(){
        List<Contact> acctList = new List<Contact>();
        acctList.add(new Contact(Name='Acme1'));
        acctList.add(new Contact(Name='Acme2'));
        insert acctList;
    }

    @AuraEnabled
    public static String addContact2() {
        // DML Statements vs Database class Method
        List<Account> acctList = new List<Account>();
        acctList.add(new Account(Name='Acme1'));
        acctList.add(new Account(Name='Acme2'));
        // nếu 1 bản ghi không thành công, phần còn lại có thể thành công
        Database.SaveResult[] insertResults = Database.insert(acctList, false);
        for( Database.SaveResult sr : srList ) {
            if (sr.isSuccess()) {
                // Operation was successful, so get the ID of the record that was processed
                System.debug('Successfully inserted account. Account ID: ' + sr.getId());
            }
            else {
                // Operation failed, so get all errors                
                for(Database.Error err : sr.getErrors()) {
                    System.debug('The following error has occurred.');                    
                    System.debug(err.getStatusCode() + ': ' + err.getMessage());
                    System.debug('Account fields that affected this error: ' + err.getFields());
                }
            }
            
        }
    }
}