import express from "express";
import Watchlist from "../models/Watchlist.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { coinId } = req.body;

    if (!coinId || !coinId.trim()) {
      return res.status(400).json({
        message: "Coin Id is required",
      });
    }

    const normalizedCoinId = coinId.trim().toLowerCase();

    const newCoin = await Watchlist.create({
      user: req.user.userId,
      coinId: normalizedCoinId,
    });

    return res.status(201).json({
      message: "Coin added to watchlist",
      coin: newCoin,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Coin already exists in your watchlist",
      });
    }

    console.error("Watchlist error", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const watchlist = await Watchlist.find({ user: req.user.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      message: "Watchlist fetched successfully",
      watchlist: watchlist,
    });
  } catch (error) {
    console.error("Watchlist fetch error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.delete("/:coinId", authMiddleware, async (req, res) => {
  try {
    const coinId = req.params.coinId;

    const normalizedCoinId = coinId.trim().toLowerCase();

    const deletedCoin = await Watchlist.findOneAndDelete({
      user: req.user.userId,
      coinId: normalizedCoinId,
    });

    if (!deletedCoin) {
      return res.status(404).json({
        message: "watchlist not found",
      });
    }
    return res.status(200).json({
      message: "Coin removed from watchlist",
      coinId: deletedCoin.coinId,
    });
  } catch (error) {
    console.error("Watchlist delete error", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;
