/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package main;

import java.io.File;
import java.io.IOException;
import java.time.LocalTime;
import java.util.Scanner;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.Clip;
import javax.sound.sampled.LineUnavailableException;
import javax.sound.sampled.UnsupportedAudioFileException;

/**
 *
 * @author HP
 */
class AlarmClock implements Runnable{
    
    private final LocalTime alarmTime;
    private final String path;
    private final Scanner scanner;
    
    AlarmClock(LocalTime alarmTime, String path, Scanner scanner){
        this.alarmTime = alarmTime;
        this.path = path;
        this.scanner = scanner;
    }
    
    @Override
    public void run(){
       
        
        while(LocalTime.now().isBefore(alarmTime)){
            try {
                Thread.sleep(1000);
                LocalTime now = LocalTime.now();
                System.out.printf("\r%02d:%02d:%02d", now.getHour(), now.getMinute(), now.getSecond());
                
            } catch (InterruptedException ex) {
                System.out.println("Thread was Interrpted");
            }
        }
        
        System.out.print("Time up");
        play(path);
    }
    public void play(String path){
            File audio = new File(path);
            
            try( AudioInputStream audioStream = AudioSystem.getAudioInputStream(audio)){
                Clip clip = AudioSystem.getClip();
                clip.open(audioStream);
                clip.start();
                
                System.out.println("press enter to stop alarm");
                scanner.nextLine();
                
                clip.close();
                
                scanner.close();
            }
            catch(UnsupportedAudioFileException e){
                System.out.println("invalid audio");
            }
            catch(LineUnavailableException e){
                System.out.println("cant find audio");
            }
            catch(IOException e){
                System.out.println("error");
            }
        }
}
