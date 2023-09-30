class ActiveExercisesController < ApplicationController

  def update
    puts "Code here"
    @exercise = ActiveExercise.find(params[:exercise_id])
    status = params[:complete]
    @exercise.complete = status
    @exercise.save
    if @exercise.save
      MultiplayerChannel.broadcast_to(
        @room,
        "Exercise completed for user"
      )
      head :ok
    end
  end

end
