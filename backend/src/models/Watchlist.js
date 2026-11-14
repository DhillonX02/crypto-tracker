import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coinId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

watchlistSchema.index(
    {user:1,coinId:1},
    {unique:true}
)

const Watchlist = mongoose.model("Watchlist",watchlistSchema);

export default Watchlist;