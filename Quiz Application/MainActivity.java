package QuizApp;

import android.app.AlertDialog;
import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import java.util.ArrayList;
import java.util.Collections;

public class MainActivity extends AppCompatActivity implements View.OnClickListener {
    TextView totalQuestionsTextView;
    TextView questionTextView;
    Button ansA, ansB, ansC;
    Button submitBtn, quit_btn;

    int score = 0;
    int x = 10;
    int ArrayIndex = 0;
    int totalQuestion = QuestionAnswer.question.length;
    int currentQuestionIndex = 0;
    String selectedAnswer = "";
    ArrayList<Integer> shuffledQuestionIndices;
    ArrayList<Integer> fiveIndices;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        totalQuestionsTextView = findViewById(R.id.total_question);
        questionTextView = findViewById(R.id.question);
        ansA = findViewById(R.id.ans_A);
        ansB = findViewById(R.id.ans_B);
        ansC = findViewById(R.id.ans_C);
        submitBtn = findViewById(R.id.submit_btn);
        quit_btn = findViewById(R.id.quit_btn);

        ansA.setOnClickListener(this);
        ansB.setOnClickListener(this);
        ansC.setOnClickListener(this);
        submitBtn.setOnClickListener(this);
        quit_btn.setOnClickListener(this);

        totalQuestionsTextView.setText("Quiz Application");

        shuffledQuestionIndices = new ArrayList<>();
        fiveIndices = new ArrayList<>(); // Initialize fiveIndices

        for (int i = 0; i < totalQuestion; i++) {
            shuffledQuestionIndices.add(i);
        }
        Collections.shuffle(shuffledQuestionIndices);

        // Take the first five indices from shuffledQuestionIndices
        for (int b = 0; b < x; b++) {
            fiveIndices.add(shuffledQuestionIndices.get(b));
        }
        loadNewQuestion();
    }

    @Override
    public void onClick(View view) {
        ansA.setBackgroundColor(Color.WHITE);
        ansB.setBackgroundColor(Color.WHITE);
        ansC.setBackgroundColor(Color.WHITE);

        Button clickedButton = (Button) view;
        if (clickedButton.getId() == R.id.submit_btn) {
            if (selectedAnswer.equals(QuestionAnswer.correctAnswers[currentQuestionIndex])) {
                score++;
            }
            ArrayIndex++;
            selectedAnswer = ""; // Reset the selected answer
            loadNewQuestion();
        } else if (clickedButton.getId() == R.id.quit_btn) {
            new AlertDialog.Builder(this)
                    .setTitle("Quiz Terminated")
                    .setMessage("Scored : " + score)
                    .setPositiveButton("Restart", (dialogInterface, i) -> restartQuiz())
                    .setCancelable(false)
                    .show();
        } else {
            selectedAnswer = clickedButton.getText().toString();
            clickedButton.setBackgroundColor(Color.MAGENTA);
        }
    }

    void loadNewQuestion() {
        if (ArrayIndex == x) {
            finishQuiz();
            return;
        }

        currentQuestionIndex = fiveIndices.get(ArrayIndex);

        questionTextView.setText(QuestionAnswer.question[currentQuestionIndex]);
        ansA.setText(QuestionAnswer.choices[currentQuestionIndex][0]);
        ansB.setText(QuestionAnswer.choices[currentQuestionIndex][1]);
        ansC.setText(QuestionAnswer.choices[currentQuestionIndex][2]);
    }

    void finishQuiz() {
        new AlertDialog.Builder(this)
                .setTitle("Quiz Completed")
                .setMessage("Scored " + score + " Out Of " + x)
                .setPositiveButton("Restart", (dialogInterface, i) -> restartQuiz())
                .setCancelable(false)
                .show();
    }

    void restartQuiz() {
        score = 0;
        ArrayIndex = 0;
        Collections.shuffle(shuffledQuestionIndices);
        // Reinitialize fiveIndices with the first five shuffled indices
        fiveIndices.clear();
        for (int b = 0; b < x; b++) {
            fiveIndices.add(shuffledQuestionIndices.get(b));
        }
        loadNewQuestion();
    }
}
