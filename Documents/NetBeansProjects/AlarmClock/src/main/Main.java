/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Main.java to edit this template
 */
package main;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Scanner;

/**
 *
 * @author HP
 */
public class Main {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        // TODO code application logic here
        
        Scanner scanner = new Scanner(System.in);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");
        LocalTime alarmTime = null;
        String path = "file_example_WAV_2MG.wav";
        
        try{
            System.out.println("enter time to set for alarm (HH:mm:ss)");
            String inputTime = scanner.nextLine();
            
            alarmTime = LocalTime.parse(inputTime, formatter);
            System.out.println("alerm set for: "+ alarmTime);
            
        }
        catch(DateTimeParseException e){
            System.out.println("Invalid format.Set time as HH:mm:ss");
        }
      
        AlarmClock alarmClock = new AlarmClock(alarmTime,path,scanner);
        Thread alarmThread = new Thread(alarmClock);
        alarmThread.start();
        
    }
    
}
